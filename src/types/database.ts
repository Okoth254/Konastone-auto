export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    fuel_type?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
    transmission: 'Automatic' | 'Manual';
    drive_type?: '2WD' | '4WD' | 'AWD' | null;
    color?: string | null;
    body_type?: 'SUV' | 'Sedan' | 'Hatchback' | 'Wagon' | 'Truck' | null;
    status: 'available' | 'reserved' | 'sold' | 'in_transit';
    description: string | null;
    folder_name: string;
    is_featured: boolean;
    main_image_url?: string | null;
    
    // CRM/Form Alignment
    vin: string;
    body_style: string;
    exterior_color: string;
    engine_type: string;
    power: string;
    drivetrain: string;

    // Extended Technical Specs
    engine_code?: string | null;
    fuel_system?: string | null;
    power_kw?: number | null;
    torque_nm?: number | null;
    length_mm?: number | null;
    width_mm?: number | null;
    weight_kg?: number | null;
    chassis_number?: string | null;

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
    vehicle_id: string | null;
    client_name: string;
    client_email: string;
    client_phone: string;
    client_message: string | null;
    
    // Extended CRM Fields
    name?: string;
    email?: string;
    phone?: string;
    source?: string;
    location?: string | null;
    trade_in_make?: string | null;
    trade_in_model?: string | null;
    trade_in_year?: number | null;
    trade_in_value?: number | null;
    finance_status?: string | null;
    finance_tier?: string | null;

    status: 'new' | 'contacted' | 'negotiation' | 'resolved' | 'dormant';
    created_at: string;
    updated_at: string;
}

export interface LeadTimelineEvent {
    id: string;
    lead_id: string;
    event_type: 'email' | 'note' | 'website_interaction' | 'status_change' | 'system';
    title: string;
    description?: string | null;
    created_at: string;
}

export interface CustomerReview {
    id: string;
    reviewer_name: string;
    vehicle_make: string | null;
    vehicle_model: string | null;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
}
