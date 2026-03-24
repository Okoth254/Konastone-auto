-- ==============================================================
-- KONASTONE AUTOS — IMAGE PIPELINE MIGRATION
-- Run this in the Supabase SQL editor ONCE.
-- This adds multi-image gallery support for vehicles.
-- ==============================================================

-- 1. ADD vehicle_images TABLE
CREATE TABLE IF NOT EXISTS public.vehicle_images (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id  UUID        NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    storage_path TEXT       NOT NULL,        -- path within the 'vehicles' storage bucket
    public_url  TEXT        NOT NULL,        -- full public URL from Supabase Storage
    is_main     BOOLEAN     NOT NULL DEFAULT false, -- is this the main/cover image?
    sort_order  INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADD main_image_url column to vehicles if not already present
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS main_image_url TEXT;

-- 3. ADD new admin-friendly columns used by the VehicleForm (not in original schema)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS body_style     TEXT;  -- alias for body_type
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS exterior_color TEXT;  -- alias for color
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS engine_type    TEXT;  -- textual engine description
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS power          TEXT;  -- e.g. "500 HP"
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS tags           TEXT[];-- array of feature tags
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS name           TEXT;  -- display name (for leads.name)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS phone          TEXT;  -- for leads.phone
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS email          TEXT;  -- for leads.email

-- 4. MAKE folder_name nullable (it was NOT NULL, blocking admin inserts)
ALTER TABLE public.vehicles ALTER COLUMN folder_name DROP NOT NULL;

-- 5. MAKE mileage nullable (admin form doesn't always collect it)
ALTER TABLE public.vehicles ALTER COLUMN mileage DROP NOT NULL;

-- 6. MAKE fuel_type nullable (admin form may not collect it yet)
ALTER TABLE public.vehicles ALTER COLUMN fuel_type DROP NOT NULL;

-- 7. MAKE transmission nullable (same reason)
ALTER TABLE public.vehicles ALTER COLUMN transmission DROP NOT NULL;

-- 8. RLS for vehicle_images
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;

-- Public can read images
DO $$ BEGIN
    CREATE POLICY "vehicle_images_public_read" ON public.vehicle_images
        FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Admin (authenticated user) can do everything
DO $$ BEGIN
    CREATE POLICY "vehicle_images_admin_all" ON public.vehicle_images
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 9. ADD CUSTOMER REVIEW FIELDS (status column for moderation)
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL;
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS review_text TEXT;
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'; -- 'pending' | 'approved' | 'rejected' | 'flagged'
ALTER TABLE public.customer_reviews ADD COLUMN IF NOT EXISTS name TEXT;  -- alias for leads.name

-- 10. ADD LEAD COLUMNS used by current app (aliases for schema columns)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS name          TEXT;  -- maps to client_name
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email         TEXT;  -- maps to client_email
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS phone         TEXT;  -- maps to client_phone
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS notes         TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS target_vehicle TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS finance_score_tier TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS expected_purchase_date TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS trade_in_year INTEGER;

-- ==============================================================
-- DONE. The above migrations are safe to run multiple times.
-- They use ADD COLUMN IF NOT EXISTS and DO ... EXCEPTION blocks.
-- ==============================================================
