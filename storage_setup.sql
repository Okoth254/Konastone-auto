-- Supabase Storage Setup for Vehicle Images
-- This script creates the `vehicle-images` bucket and applies security policies.

-------------------------------------------------------------------------------
-- 1. Create the bucket
-------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

-------------------------------------------------------------------------------
-- 2. Enable Row Level Security (RLS) on the storage.objects table
-------------------------------------------------------------------------------
-- Supabase storage uses the exact same Postgres RLS system.
-- (It is usually enabled by default, but we ensure it here)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- 3. Public access policy (Read-Only)
-------------------------------------------------------------------------------
-- Allow anyone to download or view the images (required for the website to work)
CREATE POLICY "Public Read Access on Vehicle Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'vehicle-images' );

-------------------------------------------------------------------------------
-- 4. Authenticated Admin access policy (Write/Delete)
-------------------------------------------------------------------------------
-- Allow authenticated admins to upload new images
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'vehicle-images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'vehicle-images' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated admins to update/replace images
CREATE POLICY "Admin Update Access"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'vehicle-images' 
    AND auth.role() = 'authenticated'
);
