-- ==============================================================
-- KONASTONE AUTOS — SEED DATA
-- ==============================================================
-- Run this in your Supabase SQL Editor AFTER running supabase_setup.sql
-- Go to: https://supabase.com/dashboard/project/dqfpvbyolyzbpoklrgdp/sql/new
-- ==============================================================


-- ==============================================================
-- VEHICLES
-- ==============================================================

INSERT INTO public.vehicles
    (make, model, year, price, mileage, transmission, fuel_type, body_type, color, drive_type, description, folder_name, is_featured, status)
VALUES

-- ---- AVAILABLE (NEW ARRIVALS — is_featured = true) ----

(
    'Toyota', 'Land Cruiser Prado', 2022,
    8500000, 24500, 'Automatic', 'Petrol', 'SUV', 'Pearl White', '4WD',
    'Pristine condition 2022 Prado TX-L. Full leather interior, sunroof, 7-seater. Single owner, full service history. Nairobi registered.',
    'prado-2022', true, 'available'
),
(
    'Toyota', 'Fortuner', 2021,
    5800000, 38000, 'Automatic', 'Diesel', 'SUV', 'Granite Grey', '4WD',
    'Powerful 2.8L diesel Fortuner. Well maintained with all service records intact. Comes with bull bar and roof rack.',
    'fortuner-2021', true, 'available'
),
(
    'Mercedes-Benz', 'GLE 350', 2020,
    9800000, 41200, 'Automatic', 'Petrol', 'SUV', 'Obsidian Black', 'AWD',
    'Stunning GLE 350 with AMG Sport package. Panoramic roof, Burmester sound system, 360° camera, and air suspension.',
    'gle350-2020', true, 'available'
),
(
    'BMW', '3 Series 320i', 2021,
    5200000, 29800, 'Automatic', 'Petrol', 'Sedan', 'Alpine White', '2WD',
    'Sporty 2.0L turbo 320i M-Sport with adaptive headlights, park assist, wireless charging, and digital cockpit.',
    'bmw-320i-2021', true, 'available'
),
(
    'Toyota', 'Harrier', 2022,
    5500000, 18700, 'Automatic', 'Petrol', 'SUV', 'Platinum White Pearl', '2WD',
    'Brand new shape Harrier with panoramic sunroof, JBL premium sound, leather seats, and digital rear-view mirror.',
    'harrier-2022', true, 'available'
),
(
    'Lexus', 'LX 570', 2019,
    14500000, 55000, 'Automatic', 'Petrol', 'SUV', 'Sonic Titanium', '4WD',
    'Flagship Lexus LX570 Supersport. Mark Levinson sound, 7-seater leather, 4-zone climate, Crawl Control.',
    'lexus-lx570-2019', true, 'available'
),

-- ---- AVAILABLE (FOREIGN USED — is_featured = false) ----

(
    'Honda', 'Fit Hybrid', 2020,
    1750000, 42000, 'Automatic', 'Hybrid', 'Hatchback', 'Modern Steel', '2WD',
    'Fuel-efficient Fit Hybrid in clean condition. Honda SENSING suite, Apple CarPlay, reverse camera.',
    'honda-fit-2020', false, 'available'
),
(
    'Subaru', 'Forester', 2019,
    3200000, 68000, 'Automatic', 'Petrol', 'SUV', 'Crystal White', 'AWD',
    'Reliable Forester with EyeSight driver assist system. Heated seats, leather trim, and 8-inch touchscreen.',
    'subaru-forester-2019', false, 'available'
),
(
    'Nissan', 'X-Trail', 2018,
    2800000, 72000, 'Automatic', 'Petrol', 'SUV', 'Blade Silver', '4WD',
    'Spacious 7-seat X-Trail with 360-degree Around View Monitor, ProPilot assist, and dual-zone climate.',
    'xtrail-2018', false, 'available'
),
(
    'Mazda', 'CX-5', 2020,
    3500000, 51000, 'Automatic', 'Petrol', 'SUV', 'Soul Red Crystal', 'AWD',
    'Stunning CX-5 in signature Soul Red Crystal. Bose premium audio, leather seats, i-Activsense safety suite.',
    'cx5-2020', false, 'available'
),
(
    'Volkswagen', 'Tiguan', 2019,
    3900000, 58000, 'Automatic', 'Petrol', 'SUV', 'Deep Black Pearl', '4WD',
    'Feature-packed Tiguan Highline 4MOTION. Digital cockpit, panoramic sunroof, DCC adaptive chassis.',
    'tiguan-2019', false, 'available'
),
(
    'Toyota', 'Crown Hybrid', 2020,
    3800000, 44000, 'Automatic', 'Hybrid', 'Sedan', 'Precious Black Pearl', '2WD',
    'Executive Crown Hybrid with exceptional fuel economy. JBL sound, radar cruise control, leather upholstery.',
    'crown-2020', false, 'available'
),

-- ---- IN TRANSIT ----

(
    'BMW', 'X5 xDrive40i', 2021,
    10500000, 32000, 'Automatic', 'Petrol', 'SUV', 'Mineral White', 'AWD',
    'Stunning X5 40i M-Sport. Panoramic sky lounge roof, Harman Kardon sound, air suspension, M-Sport brakes. Arriving in 14 days.',
    'bmw-x5-2021', false, 'in_transit'
),
(
    'Land Rover', 'Range Rover Sport', 2020,
    12800000, 48000, 'Automatic', 'Diesel', 'SUV', 'Santorini Black', 'AWD',
    'Premium Range Rover Sport HSE Dynamic with meridian surround sound, sliding panoramic roof, and adaptive dynamics.',
    'rr-sport-2020', false, 'in_transit'
),
(
    'Mercedes-Benz', 'GLC 300', 2021,
    7900000, 27000, 'Automatic', 'Petrol', 'SUV', 'Iridium Silver', 'AWD',
    'GLC 300 4MATIC AMG Line. 64-colour ambient lighting, Burmester soundsystem, memory seats. ETA 14 days.',
    'glc300-2021', false, 'in_transit'
);


-- ==============================================================
-- VEHICLE FEATURES
-- ==============================================================

-- Prado 2022
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Sunroof / Moonroof',
    'Full Leather Seats',
    'Adaptive Cruise Control',
    '360° Surround Camera',
    'Heated & Ventilated Seats',
    'Power Tailgate',
    '7-Seater Configuration',
    'Blind Spot Monitor',
    'Apple CarPlay & Android Auto'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Land Cruiser Prado' LIMIT 1;

-- Fortuner 2021
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Bull Bar & Underbody Protection',
    'Roof Rack',
    'Leather Seats',
    'Reverse Camera',
    'Hill Descent Control',
    'Terrain Management System',
    'Toyota Safety Sense'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Fortuner' LIMIT 1;

-- GLE 350
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'AMG Sport Package',
    'Panoramic Sliding Sunroof',
    'Burmester 3D Surround Sound',
    '360° Camera with Parking Assist',
    'Air Body Control Suspension',
    'Ambient Lighting (64 Colors)',
    'Heated & Massaging Front Seats',
    'Head-Up Display'
])
FROM public.vehicles WHERE make = 'Mercedes-Benz' AND model = 'GLE 350' LIMIT 1;

-- BMW 320i
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'M-Sport Exterior Package',
    'Digital Cockpit Pro',
    'Wireless Apple CarPlay',
    'Wireless Charging Pad',
    'Park Distance Control',
    'Adaptive LED Headlights',
    'Live Cockpit Navigation'
])
FROM public.vehicles WHERE make = 'BMW' AND model = '3 Series 320i' LIMIT 1;

-- Harrier 2022
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Panoramic Sunroof',
    'JBL Premium Audio System',
    'Full Leather Interior',
    'Digital Rear-View Mirror',
    'Toyota Safety Sense 2.0',
    'Blind Spot Monitor with Rear Cross Traffic Alert',
    'Power Liftgate',
    'Apple CarPlay & Android Auto'
])
FROM public.vehicles WHERE make = 'Toyota' AND model = 'Harrier' LIMIT 1;

-- Lexus LX570
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Mark Levinson Premium Audio',
    '7-Seater Leather Interior',
    '4-Zone Climate Control',
    'Crawl Control System',
    'Multi-Terrain Select',
    'Blind Spot Monitor',
    'Pre-Collision System',
    'Power Running Boards',
    'Rear Entertainment System'
])
FROM public.vehicles WHERE make = 'Lexus' AND model = 'LX 570' LIMIT 1;

-- BMW X5 (In Transit)
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'M-Sport Package',
    'Sky Lounge Panoramic Roof',
    'Harman Kardon Sound System',
    'Air Suspension',
    'M-Sport Brakes',
    'Gesture Control Infotainment',
    'Wireless Charging',
    'Active Park Distance Control',
    'Adaptive LED Headlights'
])
FROM public.vehicles WHERE make = 'BMW' AND model = 'X5 xDrive40i' LIMIT 1;

-- Range Rover Sport (In Transit)
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'Meridian Surround Sound System',
    'Sliding Panoramic Sunroof',
    'Adaptive Dynamics',
    'Terrain Response 2',
    'Heated & Cooled Front Seats',
    'Head-Up Display',
    'Blind Spot Assist',
    '360° Parking Aid'
])
FROM public.vehicles WHERE make = 'Land Rover' AND model = 'Range Rover Sport' LIMIT 1;

-- GLC 300 (In Transit)
INSERT INTO public.vehicle_features (vehicle_id, feature_name)
SELECT id, unnest(ARRAY[
    'AMG Line Exterior',
    'Burmester Surround Sound',
    '64-Color Ambient Lighting',
    'Memory Pilot Seat',
    'Active Parking Assist',
    'Traffic Sign Assist',
    'THERMATIC Dual-Zone Climate',
    'Keyless Go'
])
FROM public.vehicles WHERE make = 'Mercedes-Benz' AND model = 'GLC 300' LIMIT 1;


-- ==============================================================
-- SAMPLE APPROVED REVIEWS
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
    'Sarah Njoroge', 'BMW', '3 Series', 5,
    'Exceptional service from start to finish. The team was transparent about the condition of the car and there were no hidden costs. My 320i is a dream to drive!',
    true
),
(
    'James Ochieng', 'Toyota', 'Harrier', 4,
    'Great experience overall. The team was very knowledgeable and helped me pick the right car within my budget. The Harrier has been fantastic. Definitely coming back.',
    true
),
(
    'Alice Wanjiru', 'Mercedes-Benz', 'GLE 350', 5,
    'I was nervous buying such a high-end vehicle but Konastone made me feel very confident. Full disclosure on the car history and a thorough pre-delivery inspection. 10/10.',
    true
),
(
    'Brian Muthama', 'Subaru', 'Forester', 4,
    'Solid and reliable car. Konastone had the car ready and detailed when I came to pick it up. Finance was also sorted quickly. Very professional outfit.',
    true
),
(
    'Grace Achieng', 'Honda', 'Fit Hybrid', 5,
    'As a first-time car buyer I was unsure what to expect but the team walked me through everything patiently. My Fit Hybrid is giving me 20+ km/l! Very happy.',
    true
);
