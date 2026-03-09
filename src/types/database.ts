export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel_type: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
    transmission: 'Automatic' | 'Manual';
    drive_type: '2WD' | '4WD' | 'AWD' | null;
    color: string | null;
    body_type: 'SUV' | 'Sedan' | 'Hatchback' | 'Wagon' | null;
    status: 'available' | 'reserved' | 'sold' | 'in_transit';
    description: string | null;
    folder_name: string;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface VehicleFeature {
    id: string;
    vehicle_id: string;
    feature_name: string;
}

export interface Lead {
    id: string;
    created_at: string;
    client_name: string;
    client_phone: string;
    client_message: string | null;
    vehicle_id: string | null;
    status: 'new' | 'contacted' | 'resolved';
}
