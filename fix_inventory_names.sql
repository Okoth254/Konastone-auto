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
