-- ==============================================================
-- KONASTONE AUTOS — AUTHORITATIVE DATABASE SETUP
-- ==============================================================
-- Generated from full codebase audit. Safe to run multiple times.
-- Tables: vehicles, vehicle_features, leads, lead_timeline_events, customer_reviews
-- ==============================================================


-- ---------------------------------------------------------------
-- TABLE 1: vehicles
-- Used by: home/page.tsx, inventory/page.tsx, vehicle/[id]/page.tsx,
--          admin/vehicles/[id]/page.tsx, database.ts
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
    body_type     TEXT,                   -- 'SUV' | 'Sedan' | 'Hatchback' | 'Wagon' | 'Truck'
    color         TEXT,
    drive_type    TEXT,                   -- '2WD' | '4WD' | 'AWD'
    description   TEXT,
    status        TEXT         NOT NULL DEFAULT 'available',
                                          -- 'available' | 'reserved' | 'sold' | 'in_transit'
    folder_name   TEXT         NOT NULL,  -- matches /public/images/inventory/<folder_name>/
    is_featured   BOOLEAN      NOT NULL DEFAULT false,
    
    -- Extended Technical fields
    vin            TEXT,
    chassis_number TEXT,
    engine_code    TEXT,
    fuel_system    TEXT,
    power_kw       INTEGER,
    torque_nm      INTEGER,
    length_mm      INTEGER,
    width_mm       INTEGER,
    weight_kg      INTEGER,

    created_at    TIMESTAMPTZ  DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABLE 2: vehicle_features
-- Used by: vehicle/[id]/page.tsx, admin/vehicles/[id]/page.tsx
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vehicle_features (
    id            UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id    UUID    NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    feature_name  TEXT    NOT NULL
);

-- ---------------------------------------------------------------
-- TABLE 3: leads
-- Used by: admin/leads/[id]/page.tsx, database.ts
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id     UUID        REFERENCES public.vehicles(id) ON DELETE SET NULL,
    client_name    TEXT        NOT NULL,
    client_email   TEXT        NOT NULL,
    client_phone   TEXT        NOT NULL,
    client_message TEXT,
    
    -- Extended CRM fields
    location       TEXT,
    trade_in_make  TEXT,
    trade_in_model TEXT,
    trade_in_year  INTEGER,
    trade_in_value NUMERIC,
    finance_status TEXT,
    finance_tier   TEXT,

    status         TEXT        NOT NULL DEFAULT 'new',
                                         -- 'new' | 'contacted' | 'negotiation' | 'resolved' | 'dormant'
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABLE 4: lead_timeline_events
-- Used by: admin/leads/[id]/page.tsx, database.ts
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lead_timeline_events (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id        UUID        NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    event_type     TEXT        NOT NULL, -- 'email' | 'note' | 'website_interaction' | 'status_change' | 'system'
    title          TEXT        NOT NULL,
    description    TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- TABLE 5: customer_reviews
-- Used by: ReviewForm.tsx, admin/reviews/page.tsx, database.ts
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

ALTER TABLE public.vehicles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_timeline_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews      ENABLE ROW LEVEL SECURITY;

-- vehicles: public read
DO $$ BEGIN
    CREATE POLICY "vehicles_public_read" ON public.vehicles
        FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- vehicle_features: public read
DO $$ BEGIN
    CREATE POLICY "vehicle_features_public_read" ON public.vehicle_features
        FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- leads: anyone can submit an inquiry
DO $$ BEGIN
    CREATE POLICY "leads_public_insert" ON public.leads
        FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- customer_reviews: anyone can submit a review
DO $$ BEGIN
    CREATE POLICY "reviews_public_insert" ON public.customer_reviews
        FOR INSERT TO anon, authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- customer_reviews: only approved publicly visible
DO $$ BEGIN
    CREATE POLICY "reviews_public_read_approved" ON public.customer_reviews
        FOR SELECT TO anon, authenticated USING (is_approved = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Notice: Full access (SELECT, INSERT, UPDATE, DELETE) for all tables
-- should be inherently granted to the service_role key or explicitly to
-- the authenticated admin role depending on your Supabase Auth strategy.


-- ==============================================================
-- OPTIONAL: SAMPLE DATA (uncomment and run once after setup)
-- ==============================================================
/*

-- Add 3 vehicles
INSERT INTO public.vehicles
    (make, model, year, price, mileage, transmission, fuel_type, body_type, color, drive_type, folder_name, is_featured, status, vin, chassis_number, engine_code, power_kw, torque_nm, length_mm, width_mm, weight_kg)
VALUES
    ('Toyota',        'Land Cruiser Prado', 2022, 8500000, 24500, 'Automatic', 'Petrol', 'SUV',   'White',  '4WD', 'prado-2022',    true,  'available', 'JTMHV00J700123456', 'LC78-V8-2022', '1VD-FTV', 200, 650, 4990, 1980, 2740),
    ('BMW',           'X5 xDrive40i',       2019, 9200000, 45200, 'Automatic', 'Petrol', 'SUV',   'Black',  'AWD', 'bmw-x5-2019',   true,  'in_transit', 'WBA0X5BMW990231', 'X5-G05', 'B58B30M1', 250, 450, 4922, 2004, 2175),
    ('Mercedes-Benz', 'C200',               2018, 5500000, 52100, 'Automatic', 'Petrol', 'Sedan', 'Silver', '2WD', 'c_class-2018',  true,  'available', 'WDD205MERC99388', 'W205', 'M264', 135, 280, 4686, 1810, 1505);

-- Add a feature to a vehicle
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, 'Sunroof' FROM public.vehicles WHERE model = 'X5 xDrive40i' LIMIT 1;

-- Add a sample customer lead
INSERT INTO public.leads (client_name, client_email, client_phone, client_message, location, trade_in_make, trade_in_model, trade_in_year, trade_in_value, finance_status, finance_tier, status)
VALUES ('Marcus Thorne', 'm.thorne@industrial.com', '+1 (555) 902-1142', 'Requesting information on towing capacity.', 'Detroit, MI', 'Toyota', 'Nomad Heavy Duty', 2020, 42000, 'Pre-Approved', 'Tier 1 Credit', 'new');

-- Add a sample timeline event for the lead
INSERT INTO public.lead_timeline_events (lead_id, event_type, title, description)
SELECT id, 'website_interaction', 'Configuration Saved', 'Lead configured Vanguard X-Treme with Industrial Upgrade Pkg.' FROM public.leads WHERE client_name = 'Marcus Thorne' LIMIT 1;

-- Add a sample approved review
INSERT INTO public.customer_reviews (reviewer_name, vehicle_make, vehicle_model, rating, comment, is_approved)
VALUES ('John Kibet', 'Toyota', 'Land Cruiser', 5, 'Exceptional service and quick turnaround.', true);

*/
