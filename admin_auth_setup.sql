-- Admin Authentication Setup & Row Level Security (RLS)
-- This script enables RLS on the core tables to ensure that only authenticated admins
-- can modify (INSERT, UPDATE, DELETE) the inventory, while keeping SELECT open to the public.

-------------------------------------------------------------------------------
-- 1. Enable RLS on core tables
-------------------------------------------------------------------------------
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- 2. Create Public Read Policies
-- This allows anyone (even unauthenticated visitors) to view the vehicles.
-------------------------------------------------------------------------------
CREATE POLICY "Allow public read access to brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public read access to models" ON models FOR SELECT USING (true);
CREATE POLICY "Allow public read access to cars" ON cars FOR SELECT USING (true);
CREATE POLICY "Allow public read access to car_images" ON car_images FOR SELECT USING (true);

-------------------------------------------------------------------------------
-- 3. Create Authenticated Admin Write Policies
-- This ensures only logged-in users (via Supabase Auth) can modify the data.
-------------------------------------------------------------------------------

-- BRANDS
CREATE POLICY "Allow authenticated users to insert brands" 
  ON brands FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update brands" 
  ON brands FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete brands" 
  ON brands FOR DELETE USING (auth.role() = 'authenticated');

-- MODELS
CREATE POLICY "Allow authenticated users to insert models" 
  ON models FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update models" 
  ON models FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete models" 
  ON models FOR DELETE USING (auth.role() = 'authenticated');

-- CARS
CREATE POLICY "Allow authenticated users to insert cars" 
  ON cars FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update cars" 
  ON cars FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete cars" 
  ON cars FOR DELETE USING (auth.role() = 'authenticated');

-- CAR IMAGES
CREATE POLICY "Allow authenticated users to insert car_images" 
  ON car_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update car_images" 
  ON car_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete car_images" 
  ON car_images FOR DELETE USING (auth.role() = 'authenticated');

-------------------------------------------------------------------------------
-- SUMMARY
-- Your website visitors will still see the inventory perfectly.
-- However, nobody can use an API to remotely delete or alter your cars unless 
-- they are logged into Supabase Auth.
-------------------------------------------------------------------------------
