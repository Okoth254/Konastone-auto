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
