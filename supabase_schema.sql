-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Enum Types
CREATE TYPE vehicle_fuel_type AS ENUM ('Petrol', 'Diesel', 'Hybrid', 'Electric');
CREATE TYPE vehicle_transmission AS ENUM ('Automatic', 'Manual');
CREATE TYPE vehicle_drive_type AS ENUM ('2WD', '4WD', 'AWD');
CREATE TYPE vehicle_body_type AS ENUM ('SUV', 'Sedan', 'Hatchback', 'Wagon', 'Truck');
CREATE TYPE vehicle_status AS ENUM ('available', 'reserved', 'sold', 'in_transit');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'negotiation', 'resolved', 'dormant');
CREATE TYPE lead_event_type AS ENUM ('email', 'note', 'website_interaction', 'status_change', 'system');

-- Create Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    mileage NUMERIC NOT NULL,
    fuel_type TEXT NOT NULL, -- using TEXT instead of ENUM for flexibility (or cast to enum if strictness desired)
    transmission TEXT NOT NULL,
    drive_type TEXT,
    color TEXT,
    body_type TEXT,
    status vehicle_status DEFAULT 'available' NOT NULL,
    description TEXT,
    folder_name TEXT NOT NULL,
    main_image_url TEXT,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    
    -- Extended Technical Specs
    vin TEXT,
    chassis_number TEXT,
    engine_code TEXT,
    fuel_system TEXT,
    power_kw NUMERIC,
    torque_nm NUMERIC,
    length_mm NUMERIC,
    width_mm NUMERIC,
    weight_kg NUMERIC,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Vehicle Features Table
CREATE TABLE IF NOT EXISTS vehicle_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL
);

-- Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_phone TEXT NOT NULL,
    client_message TEXT,
    
    -- Extended CRM Fields
    location TEXT,
    trade_in_make TEXT,
    trade_in_model TEXT,
    trade_in_year INTEGER,
    trade_in_value NUMERIC,
    finance_status TEXT,
    finance_tier TEXT,

    status lead_status DEFAULT 'new' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Lead Timeline Events Table
CREATE TABLE IF NOT EXISTS lead_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    event_type lead_event_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Customer Reviews Table
CREATE TABLE IF NOT EXISTS customer_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_name TEXT NOT NULL,
    vehicle_make TEXT,
    vehicle_model TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create Storage Bucket for vehicle images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicles', 'vehicles', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies

-- Vehicles: Public can read, authenticated users can write
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY vehicles_read_public ON vehicles FOR SELECT USING (true);
CREATE POLICY vehicles_all_admin ON vehicles FOR ALL USING (auth.role() = 'authenticated');

-- Vehicle Features: Public can read, authenticated users can write
ALTER TABLE vehicle_features ENABLE ROW LEVEL SECURITY;
CREATE POLICY vehicle_features_read_public ON vehicle_features FOR SELECT USING (true);
CREATE POLICY vehicle_features_all_admin ON vehicle_features FOR ALL USING (auth.role() = 'authenticated');

-- Leads: Public can insert, authenticated users can read/write
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY leads_insert_public ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY leads_all_admin ON leads FOR ALL USING (auth.role() = 'authenticated');

-- Lead Timeline Events: Authenticated users can read/write
ALTER TABLE lead_timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY lead_timeline_events_all_admin ON lead_timeline_events FOR ALL USING (auth.role() = 'authenticated');

-- Customer Reviews: Public can read approved, public can insert, authenticated users can read/write
ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY customer_reviews_read_approved ON customer_reviews FOR SELECT USING (is_approved = true OR auth.role() = 'authenticated');
CREATE POLICY customer_reviews_insert_public ON customer_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY customer_reviews_all_admin ON customer_reviews FOR ALL USING (auth.role() = 'authenticated');

-- Storage Bucket RLS
-- Anyone can read from the vehicles bucket
CREATE POLICY "Public Object Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'vehicles' );

-- Authenticated users can insert to the vehicles bucket
CREATE POLICY "Admin Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'vehicles' AND auth.role() = 'authenticated');

-- Authenticated users can update/delete from vehicles bucket
CREATE POLICY "Admin Update Access" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'vehicles' AND auth.role() = 'authenticated');

CREATE POLICY "Admin Delete Access" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'vehicles' AND auth.role() = 'authenticated');

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables (drop if exists first to avoid errors on rerun)
DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
