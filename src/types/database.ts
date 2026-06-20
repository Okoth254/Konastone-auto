export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number | null;
    fuel_type?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
    transmission: 'Automatic' | 'Manual' | string | null;
    drive_type?: '2WD' | '4WD' | 'AWD' | string | null;
    color?: string | null;
    body_type?: 'SUV' | 'Sedan' | 'Hatchback' | 'Wagon' | 'Truck' | string | null;
    status: 'draft' | 'available' | 'reserved' | 'sold' | 'in_transit';
    description: string | null;
    folder_name: string | null;
    is_featured: boolean;
    featured_order?: number | null;
    main_image_url?: string | null;
    
    // CRM/Form Alignment
    vin?: string | null;
    body_style?: string | null;
    exterior_color?: string | null;
    engine_type?: string | null;
    power?: string | null;
    drivetrain?: string | null;
    tags?: string[] | null;
    vehicle_images?: VehicleImage[];

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

export interface VehicleImage {
    id?: string;
    vehicle_id?: string;
    storage_path?: string | null;
    public_url: string;
    is_main?: boolean | null;
    sort_order?: number | null;
    created_at?: string;
}

export interface Lead {
    id: string;
    vehicle_id: string | null;
    client_name?: string | null;
    client_email?: string | null;
    client_phone?: string | null;
    client_message?: string | null;
    
    // Extended CRM Fields
    name?: string;
    email?: string;
    phone?: string;
    message?: string | null;
    source?: string;
    location?: string | null;
    trade_in_make?: string | null;
    trade_in_model?: string | null;
    trade_in_year?: number | null;
    trade_in_value?: number | null;
    finance_status?: string | null;
    finance_tier?: string | null;

    status: 'new' | 'contacted' | 'negotiating' | 'sold' | 'lost' | string;
    created_at: string;
    updated_at: string;
}

export interface LeadTimelineEvent {
    id: string;
    lead_id: string;
    event_type: 'email' | 'note' | 'website_interaction' | 'status_change' | 'status_changed' | 'technical_note' | 'system' | string;
    title?: string | null;
    description?: string | null;
    created_at: string;
}

export interface CustomerReview {
    id: string;
    reviewer_name?: string | null;
    customer_name?: string | null;
    vehicle_id?: string | null;
    vehicle_make: string | null;
    vehicle_model: string | null;
    rating: number;
    comment?: string | null;
    review_text?: string | null;
    status?: 'pending' | 'approved' | 'rejected' | 'flagged' | string | null;
    is_approved: boolean;
    created_at: string;
}

export interface SiteSettings {
    contact: {
        phone: string;
        phoneFormatted: string;
        whatsapp: string;
        email: string;
        address: string;
        city: string;
        workingHours: string;
    };
    finance: {
        defaultDepositPercent: number;
        interestRate: number;
        minDepositPercent: number;
        maxDepositPercent: number;
        tenureOptions: number[];
    };
    social: {
        facebook: string;
        instagram: string;
        twitter: string;
        linkedin: string;
    };
}
