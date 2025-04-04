export interface Car {
    id?: number;
    brand: string;
    model: string;
    licensePlate: string | null;
    status: string;
    updatedAt: string | null;

    [key: string]: any;
}