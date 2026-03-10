-- ==============================================================
-- KONASTONE AUTOS — AUTHORITATIVE DATABASE SETUP
-- ==============================================================
-- Generated from full codebase audit. Safe to run multiple times.
-- Tables: vehicles, vehicle_features, leads, customer_reviews
-- ==============================================================


-- ---------------------------------------------------------------
-- TABLE 1: vehicles
-- Used by: home/page.tsx, inventory/page.tsx, vehicle/[id]/page.tsx,
--          InventorySidebar.tsx, database.ts (Vehicle interface)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicles (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    make          TEXT         NOT NULL,
    model         TEXT         NOT NULL,
    year          INTEGER      NOT NULL,
    price         NUMERIC      NOT NULL,
    mileage       INTEGER      NOT NULL,
    transmission  TEXT         NOT NULL,  -- 'Automatic' | 'Manual'
    fuel_type     TEXT         NOT NULL,  -- 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'
    body_type     TEXT,                   -- 'SUV' | 'Sedan' | 'Hatchback' | 'Wagon'
    color         TEXT,
    drive_type    TEXT,                   -- '2WD' | '4WD' | 'AWD'
    description   TEXT,
    status        TEXT         NOT NULL DEFAULT 'available',
                                          -- 'available' | 'reserved' | 'sold' | 'in_transit'
    folder_name   TEXT         NOT NULL,  -- matches /public/images/inventory/<folder_name>/
    is_featured   BOOLEAN      NOT NULL DEFAULT false,
    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABLE 2: vehicle_features
-- Used by: vehicle/[id]/page.tsx, database.ts (VehicleFeature interface)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicle_features (
    id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id    UUID    NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    feature_name  TEXT    NOT NULL
);

-- ---------------------------------------------------------------
-- TABLE 3: leads
-- Used by: LeadForm.tsx (INSERT), database.ts (Lead interface)
-- Columns inserted: client_name, client_phone, client_message, vehicle_id, status
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id     UUID        REFERENCES public.vehicles(id) ON DELETE SET NULL,
    client_name    TEXT        NOT NULL,
    client_phone   TEXT        NOT NULL,
    client_message TEXT,
    status         TEXT        NOT NULL DEFAULT 'new',
                                         -- 'new' | 'contacted' | 'resolved'
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABLE 4: customer_reviews
-- Used by: ReviewForm.tsx (INSERT), reviews/page.tsx (SELECT where is_approved=true),
--          database.ts (Review interface)
-- Columns inserted: reviewer_name, vehicle_make, vehicle_model, rating, comment, is_approved
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id             UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
    reviewer_name  TEXT       NOT NULL,
    vehicle_make   TEXT,
    vehicle_model  TEXT,
    rating         INTEGER    NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment        TEXT       NOT NULL,
    is_approved    BOOLEAN    NOT NULL DEFAULT false,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================

ALTER TABLE public.vehicles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- vehicles: public read (inventory & detail pages)
DO $$ BEGIN
    CREATE POLICY "vehicles_public_read" ON public.vehicles
        FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- vehicle_features: public read (vehicle detail page)
DO $$ BEGIN
    CREATE POLICY "vehicle_features_public_read" ON public.vehicle_features
        FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- leads: anyone can submit an inquiry (LeadForm.tsx)
--        nobody can read leads without admin auth (no SELECT policy for anon)
DO $$ BEGIN
    CREATE POLICY "leads_public_insert" ON public.leads
        FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- customer_reviews: anyone can submit a review (ReviewForm.tsx)
DO $$ BEGIN
    CREATE POLICY "reviews_public_insert" ON public.customer_reviews
        FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- customer_reviews: only approved reviews are publicly visible (reviews/page.tsx)
DO $$ BEGIN
    CREATE POLICY "reviews_public_read_approved" ON public.customer_reviews
        FOR SELECT TO anon, authenticated USING (is_approved = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;


-- ==============================================================
-- OPTIONAL: SAMPLE DATA (uncomment and run once after setup)
-- ==============================================================
/*

-- Add 3 vehicles
INSERT INTO public.vehicles
    (make, model, year, price, mileage, transmission, fuel_type, body_type, color, drive_type, folder_name, is_featured, status)
VALUES
    ('Toyota',        'Land Cruiser Prado', 2022, 8500000, 24500, 'Automatic', 'Petrol', 'SUV',   'White',  '4WD', 'prado-2022',    true,  'available'),
    ('BMW',           'X5 xDrive40i',       2019, 9200000, 45200, 'Automatic', 'Petrol', 'SUV',   'Black',  'AWD', 'bmw-x5-2019',   true,  'in_transit'),
    ('Mercedes-Benz', 'C200',               2018, 5500000, 52100, 'Automatic', 'Petrol', 'Sedan', 'Silver', '2WD', 'c_class-2018',  true,  'available');

-- Add a feature to a vehicle
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, 'Sunroof' FROM public.vehicles WHERE model = 'X5 xDrive40i' LIMIT 1;

INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, 'Leather Seats' FROM public.vehicles WHERE model = 'Land Cruiser Prado' LIMIT 1;

-- Add a sample approved review
INSERT INTO public.customer_reviews (reviewer_name, vehicle_make, vehicle_model, rating, comment, is_approved)
VALUES ('John Kibet', 'Toyota', 'Land Cruiser', 5, 'Exceptional service and quick turnaround.', true);

*/
