-- Intelligent assignment of room_type_id to existing products
-- This script analyzes product names, categories, and descriptions to assign appropriate room types

-- First, create the room_type table if it doesn't exist
CREATE TABLE IF NOT EXISTS room_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing room types and insert new ones
DELETE FROM room_type;

-- Insert the new room types
INSERT INTO room_type (name, slug) VALUES
('Study Room', 'study-room'),
('Gaming Room', 'gaming-room'),
('Bed Room', 'bed-room'),
('Home Decor', 'home-decor'),
('Living Room', 'living-room'),
('Dining Room', 'dining-room'),
('Kitchen', 'kitchen'),
('Office', 'office');

-- Add room_type_id column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS room_type_id INTEGER REFERENCES room_type(id);

-- Intelligently assign room types to existing products based on product names and descriptions
UPDATE products SET room_type_id = (
  CASE 
    -- Bed Room assignments
    WHEN LOWER(name) LIKE '%bed%' OR LOWER(name) LIKE '%bedroom%' OR LOWER(name) LIKE '%mattress%' 
         OR LOWER(name) LIKE '%nightstand%' OR LOWER(name) LIKE '%dresser%' OR LOWER(name) LIKE '%wardrobe%'
         OR LOWER(description) LIKE '%bedroom%' OR LOWER(description) LIKE '%sleep%'
    THEN (SELECT id FROM room_type WHERE slug = 'bed-room')
    
    -- Living Room assignments
    WHEN LOWER(name) LIKE '%sofa%' OR LOWER(name) LIKE '%couch%' OR LOWER(name) LIKE '%coffee table%'
         OR LOWER(name) LIKE '%tv stand%' OR LOWER(name) LIKE '%sectional%' OR LOWER(name) LIKE '%recliner%'
         OR LOWER(name) LIKE '%living%' OR LOWER(description) LIKE '%living room%'
    THEN (SELECT id FROM room_type WHERE slug = 'living-room')
    
    -- Dining Room assignments
    WHEN LOWER(name) LIKE '%dining%' OR LOWER(name) LIKE '%dining table%' OR LOWER(name) LIKE '%dining chair%'
         OR LOWER(name) LIKE '%buffet%' OR LOWER(name) LIKE '%sideboard%'
         OR LOWER(description) LIKE '%dining%'
    THEN (SELECT id FROM room_type WHERE slug = 'dining-room')
    
    -- Office assignments
    WHEN LOWER(name) LIKE '%desk%' OR LOWER(name) LIKE '%office%' OR LOWER(name) LIKE '%office chair%'
         OR LOWER(name) LIKE '%bookshelf%' OR LOWER(name) LIKE '%filing%' OR LOWER(name) LIKE '%executive%'
         OR LOWER(description) LIKE '%office%' OR LOWER(description) LIKE '%work%'
    THEN (SELECT id FROM room_type WHERE slug = 'office')
    
    -- Kitchen assignments
    WHEN LOWER(name) LIKE '%kitchen%' OR LOWER(name) LIKE '%cabinet%' OR LOWER(name) LIKE '%island%'
         OR LOWER(name) LIKE '%pantry%' OR LOWER(name) LIKE '%bar stool%'
         OR LOWER(description) LIKE '%kitchen%'
    THEN (SELECT id FROM room_type WHERE slug = 'kitchen')
    
    -- Gaming Room assignments
    WHEN LOWER(name) LIKE '%gaming%' OR LOWER(name) LIKE '%game%' OR LOWER(name) LIKE '%gamer%'
         OR LOWER(name) LIKE '%esports%' OR LOWER(name) LIKE '%rgb%' OR LOWER(name) LIKE '%led%'
         OR LOWER(description) LIKE '%gaming%'
    THEN (SELECT id FROM room_type WHERE slug = 'gaming-room')
    
    -- Study Room assignments
    WHEN LOWER(name) LIKE '%study%' OR LOWER(name) LIKE '%student%' OR LOWER(name) LIKE '%homework%'
         OR LOWER(name) LIKE '%reading%' OR LOWER(name) LIKE '%library%'
         OR LOWER(description) LIKE '%study%'
    THEN (SELECT id FROM room_type WHERE slug = 'study-room')
    
    -- Default to Home Decor for everything else
    ELSE (SELECT id FROM room_type WHERE slug = 'home-decor')
  END
)
WHERE room_type_id IS NULL;

-- Verification queries to check the results
SELECT 
  rt.name as room_type,
  COUNT(p.id) as product_count
FROM room_type rt
LEFT JOIN products p ON rt.id = p.room_type_id
GROUP BY rt.id, rt.name
ORDER BY rt.name;

-- Check if any products still have NULL room_type_id
SELECT COUNT(*) as products_without_room_type FROM products WHERE room_type_id IS NULL;

-- Show some examples of assigned products
SELECT 
  p.name as product_name,
  rt.name as room_type,
  p.price
FROM products p
JOIN room_type rt ON p.room_type_id = rt.id
ORDER BY rt.name, p.name
LIMIT 20;
