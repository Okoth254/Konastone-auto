-- ==============================================================
-- KONASTONE AUTOS — SEED DATA (REAL INVENTORY)
-- ==============================================================
-- Run this in your Supabase SQL Editor AFTER running supabase_setup.sql
-- Go to: https://supabase.com/dashboard/project/dqfpvbyolyzbpoklrgdp/sql/new
-- ==============================================================


-- ==============================================================
-- STEP 1: CLEAR EXISTING DATA
-- (vehicle_features deletes automatically via ON DELETE CASCADE)
-- ==============================================================

DELETE FROM public.vehicle_features;
DELETE FROM public.vehicles;


-- ==============================================================
-- STEP 2: INSERT REAL VEHICLES
-- ==============================================================

INSERT INTO public.vehicles
    (make, model, year, price, mileage, transmission, fuel_type, body_type, color, drive_type, description, folder_name, is_featured, status)
VALUES

-- ---- 1. Honda Vezel Hybrid ----
(
    'Honda', 'Vezel Hybrid', 2019,
    2550000, 76000, 'Automatic', 'Hybrid', 'SUV', 'Modern Steel', '2WD',
    'Stylish 2018/19 Honda Vezel Hybrid in excellent condition. Features 1500cc hybrid engine with leather seats, push start ignition, paddle shift, reverse camera, parking sensors, xenon headlights, and alloy rims. Fuel-efficient compact SUV perfect for Nairobi roads.',
    'honda-vezel', true, 'available'
),

-- ---- 2. Toyota Landcruiser Prado TX.L ----
(
    'Toyota', 'Land Cruiser Prado TX.L', 2019,
    8000000, 72000, 'Automatic', 'Petrol', 'SUV', 'Pearl White', '4WD',
    'Commanding 2019 Landcruiser Prado TX.L with 2800cc engine. Features 7 leather seats, panoramic sunroof, 360° surround camera, body kit, LED headlights, daylight running lights, fog lights, alloy rims, and multifunctional steering control.',
    'toyota-prado-txl', true, 'available'
),

-- ---- 3. Mazda 3 Petrol ----
(
    'Mazda', '3 Petrol', 2019,
    2400000, 74000, 'Automatic', 'Petrol', 'Sedan', 'Machine Grey', '2WD',
    'Sharp 2019 Mazda 3 with 1500cc engine. Equipped with multifunctional steering control, reverse camera, parking sensors, lane assist, daylight running lights, xenon headlights, fog lights, and alloy rims. Price is negotiable.',
    'mazda-3', false, 'available'
),

-- ---- 4. Mazda Atenza XDL ----
(
    'Mazda', 'Atenza XDL', 2019,
    2600000, 55000, 'Automatic', 'Petrol', 'Sedan', 'Soul Red Crystal', '2WD',
    'Executive 2019 Mazda Atenza XDL with 2200cc engine. Loaded with electric leather memory seats, push start ignition, 360° surround camera, Bose premium sound system, multifunctional steering, lane assist, xenon headlights, daylight running lights, fog lights, and alloy rims. Negotiable.',
    'mazda-atenza', false, 'available'
),

-- ---- 5. Mazda CX-5 XD L Package ----
(
    'Mazda', 'CX-5 XD L Package', 2019,
    3100000, 68000, 'Automatic', 'Diesel', 'SUV', 'Soul Red Crystal', '4WD',
    'Flagship 2019 Mazda CX-5 XD L Package with 2200cc diesel engine. Loaded with keyless entry & start, full leather upholstery, Bose premium audio, power boot, Apple CarPlay/Android Auto, adaptive LED headlights, heads-up display, adaptive cruise control, lane-keep assist, blind spot monitoring, 360° bird''s eye camera, dual-zone climate, heated front seats, heated steering wheel, navigation, and rain-sensing wipers. Deposit KES 1.5M, balance over 36 months.',
    'mazda-cx5', true, 'available'
),

-- ---- 6. Mercedes-Benz GLC 220d ----
(
    'Mercedes-Benz', 'GLC 220d', 2019,
    5800000, 83000, 'Automatic', 'Diesel', 'SUV', 'Obsidian Black', 'AWD',
    'Premium 2019 Mercedes-Benz GLC 220d with 2200cc diesel engine. Features panoramic sunroof, full leather interior, and new Nairobi registration. A refined luxury SUV at an exceptional price.',
    'mercedez-glc', true, 'available'
),

-- ---- 7. Subaru Forester ----
(
    'Subaru', 'Forester', 2019,
    3400000, 70000, 'Automatic', 'Petrol', 'SUV', 'Crystal White', 'AWD',
    'Reliable 2019 Subaru Forester with 2500cc engine. Features electric leather seats, multifunctional steering control, 360° surround camera, alloy rims, fog lights, and parking sensors. A trusted all-wheel-drive family SUV.',
    'subaru-forester', false, 'available'
),

-- ---- 8. Toyota Fielder WXB Hybrid ----
(
    'Toyota', 'Fielder WXB Hybrid', 2019,
    2100000, 60000, 'Automatic', 'Hybrid', 'Wagon', 'Silver Metallic', '2WD',
    'Economical 2019 Toyota Fielder WXB Hybrid with 1500cc engine. Features full leather seats, alloy wheels, fog lights, and low running costs. An ideal family wagon with excellent fuel economy.',
    'toyota-fielder-hybrid', false, 'available'
),

-- ---- 9. Toyota Harrier Hybrid Premium ----
(
    'Toyota', 'Harrier Hybrid Premium', 2019,
    4200000, 76000, 'Automatic', 'Hybrid', 'SUV', 'Platinum White Pearl', '2WD',
    'Sophisticated 2019 Toyota Harrier Hybrid Premium. Powered leather seats, powered boot, JBL premium sound system, multifunctional cruise control, daylight running lights, LED headlights, and fog lights. Negotiable.',
    'toyota-harrier', true, 'available'
),

-- ---- 10. Toyota Land Cruiser Prado (older) ----
(
    'Toyota', 'Land Cruiser Prado', 2019,
    4000000, 90000, 'Automatic', 'Petrol', 'SUV', 'Granite Grey', '4WD',
    'Well-maintained 2019 Toyota Land Cruiser Prado with 2800cc petrol engine. Features leather seats, alloy wheels, and a sturdy 4WD drivetrain. A dependable off-road SUV with a proven track record.',
    'toyota-prado', false, 'available'
),

-- ---- 11. Volvo XC90 T5 ----
(
    'Volvo', 'XC90 T5', 2019,
    6500000, 65000, 'Automatic', 'Petrol', 'SUV', 'Crystal White', 'AWD',
    'Stunning 2019 Volvo XC90 T5 with 2.0L inline-4 turbocharged petrol engine. All-wheel drive with driving modes: Comfort, Eco, Dynamic Sport, Off-Road. Features 7 electric leather seats, memory seats, Scandinavian interior with wood accents, Harman Kardon premium audio, 9-inch Sensus touchscreen, Apple CarPlay, heads-up display, 360° surround camera, lane keeping aid, BLIS blind spot system, adaptive LED headlights, automatic tailgate, and multi-zone climate control. Negotiable.',
    'volvo-xc90-2019', true, 'available'
),

-- ---- 12. Volvo XC90 B6 ----
(
    'Volvo', 'XC90 B6', 2022,
    11500000, 53530, 'Automatic', 'Petrol', 'SUV', 'Crystal White', 'AWD',
    'Prestigious 2022 Volvo XC90 B6 in pristine condition. 7-seater AWD with sunroof, roof rail, leather seats, cruise control, push start, multi-function steering, smart key, TV/navigation system, privacy glass, rear spoiler, anti-lock brakes, auto air conditioning, power windows, power steering, alloy wheels, fog lights, and airbags.',
    'volvo-xc90-2022', true, 'available'
);


-- ==============================================================
-- STEP 3: VEHICLE FEATURES
-- ==============================================================

-- Honda Vezel Hybrid
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Leather Seats',
    'Push Start Ignition',
    'Paddle Shift Transmission',
    'Reverse Camera',
    'Parking Sensors',
    'Xenon Headlights',
    'Fog Lights',
    'Alloy Wheels',
    'Multifunctional Steering Control',
    'Hybrid Powertrain'
])
FROM public.vehicles WHERE make = 'Honda' AND model = 'Vezel Hybrid' LIMIT 1;

-- Toyota Landcruiser Prado TX.L
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    '7-Seater Leather Interior',
    'Panoramic Sunroof',
    '360° Surround Camera',
    'Body Kit',
    'LED Headlights',
    'Daylight Running Lights',
    'Fog Lights',
    'Alloy Wheels',
    'Multifunctional Steering Control',
    '4WD Drivetrain'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Land Cruiser Prado TX.L' LIMIT 1;

-- Mazda 3 Petrol
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Reverse Camera',
    'Parking Sensors',
    'Lane Assist',
    'Xenon Headlights',
    'Daylight Running Lights',
    'Fog Lights',
    'Alloy Wheels',
    'Multifunctional Steering Control'
])
FROM public.vehicles WHERE make = 'Mazda' AND model = '3 Petrol' LIMIT 1;

-- Mazda Atenza XDL
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Electric Leather Memory Seats',
    'Push Start Ignition',
    '360° Surround Camera',
    'Bose Premium Sound System',
    'Multifunctional Steering Control',
    'Lane Assist',
    'Xenon Headlights',
    'Daylight Running Lights',
    'Fog Lights',
    'Alloy Wheels'
])
FROM public.vehicles WHERE make = 'Mazda' AND model = 'Atenza XDL' LIMIT 1;

-- Mazda CX-5 XD L Package
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Keyless Entry & Push Start',
    'Full Leather Upholstery',
    'Bose Premium Sound System',
    'Power Boot',
    'Apple CarPlay & Android Auto',
    'Adaptive LED Headlights',
    'Heads-Up Display',
    'Adaptive Cruise Control',
    'Lane-Keep Assist & Lane Departure Warning',
    'Blind Spot Monitoring',
    '360° Bird''s Eye Camera',
    'Dual-Zone Climate Control',
    'Heated Front Seats',
    'Heated Steering Wheel',
    'Navigation System',
    'Rain-Sensing Wipers',
    'Electric Parking Brake',
    'Smart Brake Support'
])
FROM public.vehicles WHERE make = 'Mazda' AND model = 'CX-5 XD L Package' LIMIT 1;

-- Mercedes-Benz GLC 220d
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Panoramic Sunroof',
    'Full Leather Interior',
    '2200cc Diesel Engine',
    'New Nairobi Registration',
    'AWD Drivetrain'
])
FROM public.vehicles WHERE make = 'Mercedes-Benz' AND model = 'GLC 220d' LIMIT 1;

-- Subaru Forester
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Electric Leather Seats',
    '360° Surround Camera',
    'Multifunctional Steering Control',
    'Alloy Wheels',
    'Fog Lights',
    'Parking Sensors',
    'AWD Drivetrain'
])
FROM public.vehicles WHERE make = 'Subaru' AND model = 'Forester' LIMIT 1;

-- Toyota Fielder WXB Hybrid
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Leather Seats',
    'Alloy Wheels',
    'Fog Lights',
    'Hybrid Powertrain',
    'Automatic Transmission'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Fielder WXB Hybrid' LIMIT 1;

-- Toyota Harrier Hybrid Premium
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Powered Leather Seats',
    'Power Boot / Tailgate',
    'JBL Premium Sound System',
    'Multifunctional Cruise Control',
    'Daylight Running Lights',
    'LED Headlights',
    'Fog Lights',
    'Hybrid Powertrain'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Harrier Hybrid Premium' LIMIT 1;

-- Toyota Land Cruiser Prado (older)
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Leather Seats',
    'Alloy Wheels',
    '4WD Drivetrain',
    'Automatic Transmission',
    'Power Windows'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Land Cruiser Prado' LIMIT 1;

-- Volvo XC90 T5
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    '7 Electric Leather Seats',
    'Memory Seats',
    'Harman Kardon Premium Sound System',
    '9-inch Sensus Touchscreen',
    'Apple CarPlay & Android Auto',
    'Heads-Up Display',
    '360° Surround Camera & Park Assist',
    'Lane Keeping Aid & BLIS Blind Spot System',
    'Adaptive LED Headlights',
    'Automatic Tailgate',
    'Multi-Zone Climate Control',
    'Scandinavian Wood Accent Interior',
    'Ambient Lighting',
    'AWD with Driving Modes (Comfort / Eco / Sport / Off-Road)'
])
FROM public.vehicles WHERE make = 'Volvo' AND model = 'XC90 T5' LIMIT 1;

-- Volvo XC90 B6
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    '7-Seater Configuration',
    'Panoramic Sunroof',
    'Roof Rails',
    'Leather Seats',
    'Cruise Control',
    'Push Start Ignition',
    'Smart Key',
    'Multi-Function Steering',
    'TV & Navigation System',
    'Privacy Glass',
    'Auto Air Conditioning',
    'Power Windows & Steering',
    'Alloy Wheels',
    'Fog Lights',
    'Anti-Lock Brakes',
    'Airbag System',
    'AWD Drivetrain'
])
FROM public.vehicles WHERE make = 'Volvo' AND model = 'XC90 B6' LIMIT 1;


-- ==============================================================
-- STEP 4: SAMPLE APPROVED REVIEWS (kept from previous seed)
-- ==============================================================

INSERT INTO public.customer_reviews
    (reviewer_name, vehicle_make, vehicle_model, rating, comment, is_approved)
VALUES
(
    'David Kamau', 'Toyota', 'Land Cruiser Prado', 5,
    'Absolutely love my Prado! Konastone made the whole process seamless. Got the car in perfect condition and the paperwork was done within a day. Highly recommend.',
    true
),
(
    'Sarah Njoroge', 'Mazda', 'CX-5', 5,
    'Exceptional service from start to finish. The team was transparent about the condition of the car and there were no hidden costs. My CX-5 is a dream to drive!',
    true
),
(
    'James Ochieng', 'Toyota', 'Harrier', 4,
    'Great experience overall. The team was very knowledgeable and helped me pick the right car within my budget. The Harrier has been fantastic. Definitely coming back.',
    true
),
(
    'Alice Wanjiru', 'Volvo', 'XC90', 5,
    'I was nervous buying such a high-end vehicle but Konastone made me feel very confident. Full disclosure on the car history and a thorough pre-delivery inspection. 10/10.',
    true
),
(
    'Brian Muthama', 'Subaru', 'Forester', 4,
    'Solid and reliable car. Konastone had the car ready and detailed when I came to pick it up. Finance was also sorted quickly. Very professional outfit.',
    true
),
(
    'Grace Achieng', 'Honda', 'Vezel Hybrid', 5,
    'As a first-time car buyer I was unsure what to expect but the team walked me through everything patiently. My Vezel Hybrid is giving me great fuel economy! Very happy.',
    true
);
