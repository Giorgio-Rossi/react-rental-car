import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useCarRequest } from '../../hooks/useCarRequest.js';
import { useCar } from '../../hooks/useCar.js';
import { useUser } from '../../hooks/useUser';
import { Table } from '../table/table';
import Navbar from '../navbar/Navbar';
import {
    getButtonConfigsAdmin,
    getButtonConfigsUser,
    getTableAdminConfig,
    getTableCustomerConfig
} from '../../config/home-config.js';

import './home.css';

const HomeComponent = () => {
    const navigate = useNavigate();
    const { user, isLoading: isAuthLoading } = useAuth();
    const { cars, getCars } = useCar();
    const { users, getUsers } = useUser();
    const {
        requests,
        fetchAdminRequests,
        fetchUserRequests,
        deleteRequest,
        loading
    } = useCarRequest();

    const tableAdminConfig = getTableAdminConfig();
    const tableCustomerConfig = getTableCustomerConfig();
    const buttonConfigsAdmin = getButtonConfigsAdmin();
    const buttonConfigsUser = getButtonConfigsUser();

    const memoizedGetCars = useCallback(getCars, [getCars]);
    const memoizedGetUsers = useCallback(getUsers, [getUsers]);
    const memoizedFetchAdminRequests = useCallback(fetchAdminRequests, [fetchAdminRequests]);
    const memoizedFetchUserRequests = useCallback(fetchUserRequests, [fetchUserRequests]);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!user) return;

                await Promise.all([
                    memoizedGetCars(),
                    memoizedGetUsers()
                ]);

                if (user.role === 'ROLE_ADMIN') {
                    await memoizedFetchAdminRequests();
                } else if (user.username) {
                    await memoizedFetchUserRequests(user.username);
                }
            } catch (error) {
                console.error("Errore durante il caricamento dei dati:", error);
            }
        };

        if (!isAuthLoading) {
            if (!user) {
                console.log("User is null: ", users);
                navigate('/login');
            } else {
                loadData();
            }
        }
    }, [user, isAuthLoading, navigate, memoizedGetCars, memoizedGetUsers, memoizedFetchAdminRequests, memoizedFetchUserRequests]);

    const handleActionClick = async (action, row) => {
        if (action === 'Modifica') {
            navigate(`/edit-request/${row.id}`, { state: { requestData: row } });
        } else if (action === 'Cancella') {
            try {
                await deleteRequest(row.id);
            } catch (error) {
                console.error("Error deleting request:", error);

            }
        }
    };

    const handleNavButtonClick = useCallback((path) => {
        if (path) navigate(path);
    }, [navigate]);

    const currentButtonConfigs = user?.role === 'ROLE_ADMIN' ? buttonConfigsAdmin : buttonConfigsUser;
    const currentTableConfig = user?.role === 'ROLE_CUSTOMER' ? tableCustomerConfig : tableAdminConfig;

    const tableData = useCallback(() => {
        if (!requests || !users || !cars) return [];

        return requests.map(request => {
            const user = users.find(u => u.id === request.userId);

            const fullName = user ? user.fullName : 'Utente non trovato';
            const carDetails = getCarDetails(request.carId, cars);
            return {
                ...request,
                fullName,
                start_reservation: formatDate(request.startReservation),
                end_reservation: formatDate(request.endReservation),
                carDetails
            };
        });

    }, [requests, users, cars]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-container">
            {user?.role && (
                <Navbar
                    buttons={currentButtonConfigs}
                    onButtonClick={handleNavButtonClick}
                    username={user?.username}
                />
            )}

            <Table
                config={currentTableConfig}
                data={tableData()}
                onActionClick={({ action, row }) => handleActionClick(action, row)}
            />
        </div>
    );
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('it-IT');
};

const getCarDetails = (carID, cars) => {
    if (!cars || cars.length === 0) return 'Auto non trovata';

    if (Array.isArray(carID)) {
        return carID.map(id => {
            const car = cars.find(c => c.id === id);
            return car ? car.licensePlate : 'Auto non trovata';
        }).join(', ');
    }

    const car = cars.find(c => c.id === carID);
    return car ? car.licensePlate : 'Auto non trovata';
};

export default HomeComponent;