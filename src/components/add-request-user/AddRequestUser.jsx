import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './add-request-user.css'
import axiosIstance from '../../context/axiosInterceptor';

export default function AddRequestUser() {
  const navigate = useNavigate();
  const [availableCars, setAvailableCars] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState('');
  const [currentUserID, setCurrentUserID] = useState(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const pad = (n) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
      `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.0`;
  };

  const startReservation = watch('start_reservation');
  const endReservation = watch('end_reservation');

  const formattedStart = formatDateTime(startReservation);
  const formattedEnd = formatDateTime(endReservation);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
      setLoggedInUser(currentUser.username);
      setCurrentUserID(currentUser.id);
    }

    const token = sessionStorage.getItem('auth-token');
  }, []);


  const fetchAvailableCars = () => {
    if (startReservation && endReservation) {
      axiosIstance.get('http://localhost:8080/api/car-requests/available-cars', {
        params: {
          start: formattedStart,
          end: formattedEnd
        },
    
      })
        .then(res => setAvailableCars(res.data))
        .catch(err => console.error('Errore nel recupero auto disponibili:', err));
    }
  };

  const onSubmit = (data) => {
        const requestPayload = {
          userID: currentUserID,
          carID: Number(data.car_id),
          startReservation: new Date(data.start_reservation).toISOString(),
          endReservation: new Date(data.end_reservation).toISOString(),
          status: 'IN_ATTESA',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        axiosIstance.post('http://localhost:8080/customer/add-request', requestPayload)
          .then(() => navigate('/home'))
          .catch(err => console.error('Errore nel salvataggio:', err));
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="userName">User Name:</label>
        <input id="userName" value={loggedInUser} disabled />
      </div>

      <div>
        <label htmlFor="start_reservation">Data inizio prenotazione:</label>
        <input id="start_reservation" type="datetime-local" {...register("start_reservation", { required: true })} />
        {errors.start_reservation && <span>Obbligatorio</span>}
      </div>

      <div>
        <label htmlFor="end_reservation">Data fine prenotazione:</label>
        <input id="end_reservation" type="datetime-local" {...register("end_reservation", { required: true })} />
        {errors.end_reservation && <span>Obbligatorio</span>}
      </div>

      <button type="button" onClick={fetchAvailableCars} disabled={!startReservation || !endReservation}>
        Mostra auto disponibili
      </button>

      {availableCars.length > 0 && (
        <div>
          <label htmlFor="car_id">Seleziona un'auto:</label>
          <select id="car_id" {...register("car_id", { required: true })}>
            <option value="">Seleziona un'auto</option>
            {availableCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.brand} - {car.model} - {car.licensePlate}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="submit" disabled={!watch("car_id")}>Invia</button>
    </form>
  );
}
