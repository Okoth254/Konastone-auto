-- Advanced Filtering Schema Updates
-- Adds missing columns required for the new advanced filter UI

-- Add 'condition' column (New or Used)
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS condition TEXT DEFAULT 'Used';

-- Add 'location' column (Branch location)
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Mombasa';

-- Optional: If any cars in the current inventory should be explicitly marked as 'New', you can do so below.
-- Usually, all cars in a dealership are 'Used' (foreign used), but you can customize this:
-- UPDATE cars SET condition = 'New' WHERE year = 2024;

-- Optional: If any cars are located in Nairobi or Kisumu instead of the default Mombasa, update below:
-- UPDATE cars SET location = 'Nairobi' WHERE title LIKE '%Prado%';
-- Fix Double Branding Issue in `models` table
-- The website UI renders titles as `{Brand} {Model}`. 
-- Since the models table currently includes the brand (e.g., 'Toyota Fielder'),
-- it results in duplicates like 'Toyota Toyota Fielder'. 
-- This script removes the brand prefixes from the model names.

UPDATE models SET name = 'Fielder' WHERE name = 'Toyota Fielder';
UPDATE models SET name = 'Vezel' WHERE name = 'Honda Vezel';
UPDATE models SET name = 'Prado' WHERE name = 'Landcruiser Prado';
UPDATE models SET name = 'Atenza' WHERE name = 'Mazda Atenza';
UPDATE models SET name = 'CX-5' WHERE name = 'Mazda CX-5';
UPDATE models SET name = '3' WHERE name = 'Mazda 3';
UPDATE models SET name = 'Forester' WHERE name = 'Subaru Forester';
UPDATE models SET name = 'XC-90' WHERE name = 'Volvo XC-90';
UPDATE models SET name = 'Harrier' WHERE name = 'Toyota Harrier';

-- Fix the Mercedes-Benz model name (currently 'Mercedes Benz' in DB, which causes 'Mercedes-Benz Mercedes Benz')
-- Changing it to the specific class based on the inventory (GLC 220d)
UPDATE models SET name = 'GLC 220d' WHERE name = 'Mercedes Benz';

-- The website natively separates "Hire Purchase" and "Cash/Direct Purchase" via a toggle on the /inventory route.
-- This toggle filters cars based on the `hire_purchase_available` boolean field in the `cars` table. 
-- Below are helper statements to update the hire purchase flags if you want to classify specific cars as Cash-only or HP-supported.

-- To make a specific car available for Hire Purchase (Moves it to the Hire Purchase tab):
-- UPDATE cars SET hire_purchase_available = true WHERE title LIKE '%Vezel%';

-- To make a specific car Cash ONLY (Moves it strictly to the Direct Purchase tab):
-- UPDATE cars SET hire_purchase_available = false WHERE title LIKE '%Prado%';

-- Example: Set all existing vehicles to Cash Only as a baseline (Uncomment if needed):
-- UPDATE cars SET hire_purchase_available = false;
-- Add new brand: Honda
INSERT INTO brands (name, slug) VALUES ('Honda', 'honda') ON CONFLICT (slug) DO NOTHING;

-- 2019 Honda Vezel Hybrid
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name, body_type) VALUES ((SELECT id FROM brands WHERE name = 'Honda'), 'Honda Vezel', 'suv') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Honda Vezel'; 
  END IF;
  INSERT INTO cars (model_id, title, year, price, mileage, fuel_type, transmission, hire_purchase_available, min_deposit, monthly_payment, description, specifications, status)
  VALUES (v_model_id, '2019 Honda Vezel Hybrid', 2019, 2550000, 76000, 'Hybrid', 'Automatic', true, 600000, 48000, 'Stylish and fuel-efficient Honda Vezel Hybrid. Features leather seats, xenon headlights, and push-start ignition.', '{"features": ["Leather Seats","Alloy Rims","Fog Lights","Xenon Headlights","Multifunctional Steering Control","Reverse Camera","Peddle Shift","Push Start Ignition","Parking Sensors"]}', 'available')
  RETURNING id INTO v_car_id;
  
  -- Insert Images (34 total)
  FOR i IN 1..34 LOOP
    INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
    VALUES (v_car_id, '/images/inventory/honda-vezel/' || i || '.jpeg', CASE WHEN i = 1 THEN true ELSE false END, i - 1);
  END LOOP;
END $$;


-- 2019 Mazda 3 Petrol
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name, body_type) VALUES ((SELECT id FROM brands WHERE name = 'Mazda'), 'Mazda 3', 'hatchback') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Mazda 3'; 
  END IF;
  INSERT INTO cars (model_id, title, year, price, mileage, fuel_type, transmission, hire_purchase_available, min_deposit, monthly_payment, description, specifications, status)
  VALUES (v_model_id, '2019 Mazda 3 Petrol', 2019, 2400000, 74000, 'Petrol', 'Automatic', true, 550000, 45000, 'Sleek and sporty 2019 Mazda 3. Packed with safety features like Lane Assist and daylight running lights. Perfect for city driving.', '{"features": ["Multifunctional Steering Control","Reverse Camera","Parking Sensors","Lane Assist","Daylight Running Lights","Xenon Headlights","Fog Lights","Alloy Rims"]}', 'available')
  RETURNING id INTO v_car_id;
  
  -- Insert Images (12 total)
  FOR i IN 1..12 LOOP
    INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
    VALUES (v_car_id, '/images/inventory/mazda-3/' || i || '.jpeg', CASE WHEN i = 1 THEN true ELSE false END, i - 1);
  END LOOP;
END $$;


-- 2019 Mazda Atenza XDL
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name, body_type) VALUES ((SELECT id FROM brands WHERE name = 'Mazda'), 'Mazda Atenza', 'sedan') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Mazda Atenza'; 
  END IF;
  INSERT INTO cars (model_id, title, year, price, mileage, fuel_type, transmission, hire_purchase_available, min_deposit, monthly_payment, description, specifications, status)
  VALUES (v_model_id, '2019 Mazda Atenza XDL', 2019, 2600000, 60000, 'Diesel', 'Automatic', true, 650000, 49000, 'Premium Mazda Atenza XDL sedan featuring electric memory leather seats, a 360-degree camera, and a high-end Bose sound system.', '{"features": ["Electric Leather Seats","Memory Seats","Multifunctional Steering Control","Push Start Ignition","Lane Assist","360 Degrees Camera","Bose Speaker Sound System","Alloy Rims","Fog Light","Daylight Running Light","Xenon Headlights"]}', 'available')
  RETURNING id INTO v_car_id;
  
  -- Insert Images (13 total)
  FOR i IN 1..13 LOOP
    INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
    VALUES (v_car_id, '/images/inventory/mazda-atenza/' || i || '.jpeg', CASE WHEN i = 1 THEN true ELSE false END, i - 1);
  END LOOP;
END $$;


-- 2019 Landcruiser Prado TX.L
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name, body_type) VALUES ((SELECT id FROM brands WHERE name = 'Toyota'), 'Landcruiser Prado', 'suv') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Landcruiser Prado'; 
  END IF;
  INSERT INTO cars (model_id, title, year, price, mileage, fuel_type, transmission, hire_purchase_available, min_deposit, monthly_payment, description, specifications, status)
  VALUES (v_model_id, '2019 Landcruiser Prado TX.L', 2019, 8000000, 72000, 'Diesel', 'Automatic', false, 0, 0, 'Highly sought-after Landcruiser Prado TX.L featuring 7 luxury leather seats, a built-in sunroof, and an aerodynamic body kit.', '{"features": ["7 Leather Seats","Multifunctional Steering Control","360 Degrees Camera","Body Kit","Sunroof","Daylight Running Lights","LED Headlights","Fog Lights","Alloy Rims"]}', 'available')
  RETURNING id INTO v_car_id;
  
  -- Insert Images (15 total)
  FOR i IN 1..15 LOOP
    INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
    VALUES (v_car_id, '/images/inventory/toyota-prado-txl/' || i || '.jpeg', CASE WHEN i = 1 THEN true ELSE false END, i - 1);
  END LOOP;
END $$;


-- 2019 Toyota Fielder WXB Hybrid
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name, body_type) VALUES ((SELECT id FROM brands WHERE name = 'Toyota'), 'Toyota Fielder', 'sedan') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Toyota Fielder'; 
  END IF;
  INSERT INTO cars (model_id, title, year, price, mileage, fuel_type, transmission, hire_purchase_available, min_deposit, monthly_payment, description, specifications, status)
  VALUES (v_model_id, '2019 Toyota Fielder WXB Hybrid', 2019, 1950000, 80000, 'Hybrid', 'Automatic', true, 450000, 42000, 'Exceptionally fuel-efficient Toyota Fielder WXB Hybrid. Spacious, reliable, and perfectly suited for daily commutes or long journeys.', '{"features": ["Hybrid Efficiency","Spacious Interior","Alloy Wheels","Fog Lights","Multifunctional Steering"]}', 'available')
  RETURNING id INTO v_car_id;
  
  -- Insert Images (7 total)
  FOR i IN 1..7 LOOP
    INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
    VALUES (v_car_id, '/images/inventory/toyota-fielder-hybrid/' || i || '.jpeg', CASE WHEN i = 1 THEN true ELSE false END, i - 1);
  END LOOP;
END $$;
