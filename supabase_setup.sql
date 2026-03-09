-- ==========================================
-- KONASTONE AUTOS - COMPLETE DATABASE SETUP
-- ==========================================
-- This script is idempotent. You can run it multiple times safely.

-- 1. Create the `vehicles` table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    body_type TEXT,
    condition TEXT,
    mileage INTEGER NOT NULL,
    transmission TEXT NOT NULL,
    fuel_type TEXT NOT NULL,
    color TEXT,
    drive_type TEXT,
    status TEXT NOT NULL DEFAULT 'available', -- e.g., 'available', 'sold', 'in_transit'
    folder_name TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the `vehicle_features` table
CREATE TABLE IF NOT EXISTS public.vehicle_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    feature_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create the `leads` table for inquiries
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new', -- e.g., 'new', 'contacted', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create the `customer_reviews` table
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    vehicle_purchased TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- SECURITY: SETTING UP ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- RLS POLICIES FOR `vehicles`
-- ------------------------------------------
-- Allow anyone to read vehicles
DO $$ BEGIN
    CREATE POLICY "Allow anonymous read access on vehicles" ON public.vehicles
        FOR SELECT
        TO anon, authenticated
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------
-- RLS POLICIES FOR `vehicle_features`
-- ------------------------------------------
-- Allow anyone to read vehicle features
DO $$ BEGIN
    CREATE POLICY "Allow anonymous read access on vehicle_features" ON public.vehicle_features
        FOR SELECT
        TO anon, authenticated
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------
-- RLS POLICIES FOR `leads`
-- ------------------------------------------
-- Allow anyone to insert (submit) a lead
DO $$ BEGIN
    CREATE POLICY "Allow anonymous insert on leads" ON public.leads
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Only authenticated admins can view leads (requires auth setup to fully enforce, but default restricts anon SELECT)
-- (No SELECT policy for anon on leads)

-- ------------------------------------------
-- RLS POLICIES FOR `customer_reviews`
-- ------------------------------------------
-- Allow anyone to insert a review
DO $$ BEGIN
    CREATE POLICY "Allow anonymous insert on customer_reviews" ON public.customer_reviews
        FOR INSERT
        TO anon, authenticated
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Allow anyone to read ONLY approved reviews
DO $$ BEGIN
    CREATE POLICY "Allow anonymous read on approved reviews" ON public.customer_reviews
        FOR SELECT
        TO anon, authenticated
        USING (is_approved = true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- OPTIONAL: SAMPLE DATA SEEDING (Run once)
-- ==========================================
/*
INSERT INTO public.vehicles (make, model, year, price, mileage, transmission, fuel_type, folder_name, is_featured, status) VALUES
('Toyota', 'Land Cruiser Prado', 2022, 8500000, 24500, 'Automatic', 'Petrol', 'prado-2022', true, 'available'),
('BMW', 'X5 xDrive40i', 2019, 9200000, 45200, 'Automatic', 'Petrol', 'bmw-x5-2019', true, 'in_transit'),
('Mercedes-Benz', 'C200', 2018, 5500000, 52100, 'Automatic', 'Petrol', 'c_class-2018', true, 'available');

-- Get the UUIDs for these and add a feature (example below uses a subquery to find a matching ID)
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, 'Sunroof' FROM public.vehicles WHERE model = 'X5 xDrive40i' LIMIT 1;

-- Add a sample approved review
INSERT INTO public.customer_reviews (customer_name, vehicle_purchased, rating, comment, is_approved)
VALUES ('John Kibet', 'Toyota Land Cruiser', 5, 'Exceptional service and quick turnaround.', true);
*/
