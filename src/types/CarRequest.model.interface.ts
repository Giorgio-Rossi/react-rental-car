export interface CarRequest {
    id?: number;
    userID?: number;
    carID: number;
    status: string;
    startReservation: string;
    endReservation: string;
    createdAt: string;
    updatedAt: string;

    [key: string]: any;

}
