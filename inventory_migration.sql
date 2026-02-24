-- Konastone Autos - Final Database Schema & Inventory Migration
-- Run this in the Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    body_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES models(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    year INTEGER,
    price DECIMAL(12,2),
    mileage INTEGER,
    fuel_type TEXT,
    transmission TEXT,
    description TEXT,
    status TEXT DEFAULT 'available',
    hire_purchase_available BOOLEAN DEFAULT false,
    min_deposit DECIMAL(12,2),
    monthly_payment DECIMAL(12,2),
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS car_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO brands (name, slug) VALUES 
    ('Toyota', 'toyota'), ('Mazda', 'mazda'), ('Mercedes-Benz', 'mercedes-benz'), ('Subaru', 'subaru'), ('Volvo', 'volvo')
    ON CONFLICT (slug) DO NOTHING;

-- 2019 Mazda CX-5 XD L Package
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Mazda'), 'Mazda CX-5') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Mazda CX-5'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Mazda CX-5 XD L Package', 2019, true, 1500000, 50000, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/2.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/3.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/4.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/5.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/6.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/7.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/8.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mazda-cx5/9.jpeg', false, 11);
END $$;

-- 2019 Landcruiser Prado TX.L
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Toyota'), 'Landcruiser Prado') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Landcruiser Prado'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Landcruiser Prado TX.L', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/2.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/3.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/4.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/5.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/6.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/7.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/8.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-prado/9.jpeg', false, 11);
END $$;

-- 2019 Mercedes Benz GLC220d
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Mercedes-Benz'), 'Mercedes Benz') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Mercedes Benz'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Mercedes Benz GLC220d', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/13.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/2.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/3.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/4.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/5.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/6.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/7.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/8.jpeg', false, 11);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/mercedez-glc/9.jpeg', false, 12);
END $$;

-- 2019 Subaru Forester
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Subaru'), 'Subaru Forester') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Subaru Forester'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Subaru Forester', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/13.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/14.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/15.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/16.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/17.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/18.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/19.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/2.jpeg', false, 11);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/20.jpeg', false, 12);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/21.jpeg', false, 13);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/22.jpeg', false, 14);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/23.jpeg', false, 15);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/24.jpeg', false, 16);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/25.jpeg', false, 17);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/26.jpeg', false, 18);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/27.jpeg', false, 19);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/28.jpeg', false, 20);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/29.jpeg', false, 21);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/3.jpeg', false, 22);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/30.jpeg', false, 23);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/31.jpeg', false, 24);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/32.jpeg', false, 25);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/33.jpeg', false, 26);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/34.jpeg', false, 27);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/35.jpeg', false, 28);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/36.jpeg', false, 29);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/37.jpeg', false, 30);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/38.jpeg', false, 31);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/39.jpeg', false, 32);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/4.jpeg', false, 33);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/40.jpeg', false, 34);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/41.jpeg', false, 35);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/42.jpeg', false, 36);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/43.jpeg', false, 37);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/44.jpeg', false, 38);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/45.jpeg', false, 39);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/46.jpeg', false, 40);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/47.jpeg', false, 41);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/48.jpeg', false, 42);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/49.jpeg', false, 43);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/5.jpeg', false, 44);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/6.jpeg', false, 45);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/7.jpeg', false, 46);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/8.jpeg', false, 47);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/subaru-forester/9.jpeg', false, 48);
END $$;

-- 2019 Toyota Fielder WXB
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Toyota'), 'Toyota Fielder') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Toyota Fielder'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Toyota Fielder WXB', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/2.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/3.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/4.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/5.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/6.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-fielder/7.jpeg', false, 6);
END $$;

-- 2019 Toyota Harrier Hybrid Premium
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Toyota'), 'Toyota Harrier') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Toyota Harrier'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Toyota Harrier Hybrid Premium', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/13.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/14.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/15.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/16.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/17.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/18.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/19.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/2.jpeg', false, 11);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/3.jpeg', false, 12);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/4.jpeg', false, 13);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/5.jpeg', false, 14);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/6.jpeg', false, 15);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/7.jpeg', false, 16);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/8.jpeg', false, 17);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/toyota-harrier/9.jpeg', false, 18);
END $$;

-- 2019 Volvo XC-90 T5
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Volvo'), 'Volvo XC-90') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Volvo XC-90'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2019 Volvo XC-90 T5', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/13.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/14.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/15.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/16.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/17.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/18.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/19.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/2.jpeg', false, 11);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/20.jpeg', false, 12);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/3.jpeg', false, 13);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/4.jpeg', false, 14);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/5.jpeg', false, 15);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/6.jpeg', false, 16);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/7.jpeg', false, 17);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/8.jpeg', false, 18);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2019/9.jpeg', false, 19);
END $$;

-- 2022 Volvo XC90 B6 AWD Inscription
DO $$
DECLARE
  v_model_id UUID;
  v_car_id UUID;
BEGIN
  INSERT INTO models (brand_id, name) VALUES ((SELECT id FROM brands WHERE name = 'Volvo'), 'Volvo XC90') 
     ON CONFLICT DO NOTHING RETURNING id INTO v_model_id;
  IF v_model_id IS NULL THEN 
    SELECT id INTO v_model_id FROM models WHERE name = 'Volvo XC90'; 
  END IF;
  INSERT INTO cars (model_id, title, year, hire_purchase_available, min_deposit, monthly_payment, status)
  VALUES (v_model_id, '2022 Volvo XC90 B6 AWD Inscription', 2019, false, 0, 0, 'available')
  RETURNING id INTO v_car_id;
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/1.jpeg', true, 0);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/10.jpeg', false, 1);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/11.jpeg', false, 2);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/12.jpeg', false, 3);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/13.jpeg', false, 4);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/14.jpeg', false, 5);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/15.jpeg', false, 6);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/16.jpeg', false, 7);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/17.jpeg', false, 8);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/18.jpeg', false, 9);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/19.jpeg', false, 10);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/2.jpeg', false, 11);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/3.jpeg', false, 12);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/4.jpeg', false, 13);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/5.jpeg', false, 14);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/6.jpeg', false, 15);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/7.jpeg', false, 16);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/8.jpeg', false, 17);
  INSERT INTO car_images (car_id, image_url, is_primary, sort_order)
  VALUES (v_car_id, '/images/inventory/volvo-xc90-2022/9.jpeg', false, 18);
END $$;

