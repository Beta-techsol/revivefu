-- Intelligent assignment of room_type_id to existing products
-- This script analyzes product names, categories, and descriptions to assign appropriate room types

-- First, let's see what we have
-- SELECT COUNT(*) FROM products WHERE room_type_id IS NULL;

-- 1. Assign based on product names containing room-specific keywords
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'bed-room')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%bed%' OR 
  LOWER(name) LIKE '%bedroom%' OR 
  LOWER(name) LIKE '%mattress%' OR 
  LOWER(name) LIKE '%nightstand%' OR 
  LOWER(name) LIKE '%dresser%' OR 
  LOWER(name) LIKE '%wardrobe%' OR
  LOWER(description) LIKE '%bedroom%' OR
  LOWER(description) LIKE '%sleeping%'
);

-- 2. Assign Living Room products
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'living-room')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%sofa%' OR 
  LOWER(name) LIKE '%couch%' OR 
  LOWER(name) LIKE '%coffee table%' OR 
  LOWER(name) LIKE '%tv stand%' OR 
  LOWER(name) LIKE '%entertainment%' OR 
  LOWER(name) LIKE '%living%' OR
  LOWER(name) LIKE '%sectional%' OR
  LOWER(name) LIKE '%recliner%' OR
  LOWER(name) LIKE '%ottoman%' OR
  LOWER(description) LIKE '%living room%' OR
  LOWER(description) LIKE '%family room%'
);

-- 3. Assign Dining Room products
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'dining-room')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%dining%' OR 
  LOWER(name) LIKE '%table%' OR 
  LOWER(name) LIKE '%chair%' OR 
  LOWER(name) LIKE '%buffet%' OR 
  LOWER(name) LIKE '%sideboard%' OR 
  LOWER(name) LIKE '%china cabinet%' OR
  LOWER(description) LIKE '%dining%' OR
  LOWER(description) LIKE '%eating%'
);

-- 4. Assign Office products
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'office')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%desk%' OR 
  LOWER(name) LIKE '%office%' OR 
  LOWER(name) LIKE '%chair%' OR 
  LOWER(name) LIKE '%bookshelf%' OR 
  LOWER(name) LIKE '%filing%' OR 
  LOWER(name) LIKE '%executive%' OR
  LOWER(name) LIKE '%computer%' OR
  LOWER(name) LIKE '%work%' OR
  LOWER(description) LIKE '%office%' OR
  LOWER(description) LIKE '%workspace%' OR
  LOWER(description) LIKE '%professional%'
);

-- 5. Assign Kitchen products
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'kitchen')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%kitchen%' OR 
  LOWER(name) LIKE '%cabinet%' OR 
  LOWER(name) LIKE '%island%' OR 
  LOWER(name) LIKE '%pantry%' OR 
  LOWER(name) LIKE '%bar stool%' OR 
  LOWER(name) LIKE '%counter%' OR
  LOWER(description) LIKE '%kitchen%' OR
  LOWER(description) LIKE '%cooking%' OR
  LOWER(description) LIKE '%culinary%'
);

-- 6. Assign Gaming Room products
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'gaming-room')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%gaming%' OR 
  LOWER(name) LIKE '%game%' OR 
  LOWER(name) LIKE '%gamer%' OR 
  LOWER(name) LIKE '%esports%' OR 
  LOWER(name) LIKE '%rgb%' OR 
  LOWER(name) LIKE '%led%' OR
  LOWER(description) LIKE '%gaming%' OR
  LOWER(description) LIKE '%gamer%' OR
  LOWER(description) LIKE '%esports%'
);

-- 7. Assign Study Room products
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'study-room')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%study%' OR 
  LOWER(name) LIKE '%student%' OR 
  LOWER(name) LIKE '%homework%' OR 
  LOWER(name) LIKE '%reading%' OR 
  LOWER(name) LIKE '%library%' OR 
  LOWER(name) LIKE '%academic%' OR
  LOWER(description) LIKE '%study%' OR
  LOWER(description) LIKE '%student%' OR
  LOWER(description) LIKE '%learning%' OR
  LOWER(description) LIKE '%academic%'
);

-- 8. Assign Home Decor products (catch-all for decorative items)
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'home-decor')
WHERE room_type_id IS NULL 
AND (
  LOWER(name) LIKE '%decor%' OR 
  LOWER(name) LIKE '%decoration%' OR 
  LOWER(name) LIKE '%art%' OR 
  LOWER(name) LIKE '%mirror%' OR 
  LOWER(name) LIKE '%lamp%' OR 
  LOWER(name) LIKE '%lighting%' OR
  LOWER(name) LIKE '%vase%' OR
  LOWER(name) LIKE '%frame%' OR
  LOWER(name) LIKE '%candle%' OR
  LOWER(name) LIKE '%plant%' OR
  LOWER(name) LIKE '%rug%' OR
  LOWER(name) LIKE '%curtain%' OR
  LOWER(name) LIKE '%pillow%' OR
  LOWER(name) LIKE '%throw%' OR
  LOWER(description) LIKE '%decorative%' OR
  LOWER(description) LIKE '%accent%' OR
  LOWER(description) LIKE '%aesthetic%'
);

-- 9. For remaining products, assign based on category if available
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'living-room')
WHERE room_type_id IS NULL 
AND category_id IN (
  SELECT id FROM categories WHERE LOWER(name) LIKE '%living%' OR LOWER(name) LIKE '%sofa%'
);

UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'bed-room')
WHERE room_type_id IS NULL 
AND category_id IN (
  SELECT id FROM categories WHERE LOWER(name) LIKE '%bed%' OR LOWER(name) LIKE '%bedroom%'
);

UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'dining-room')
WHERE room_type_id IS NULL 
AND category_id IN (
  SELECT id FROM categories WHERE LOWER(name) LIKE '%dining%'
);

UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'office')
WHERE room_type_id IS NULL 
AND category_id IN (
  SELECT id FROM categories WHERE LOWER(name) LIKE '%office%' OR LOWER(name) LIKE '%desk%'
);

-- 10. Default assignment for any remaining products (assign to Home Decor as catch-all)
UPDATE products 
SET room_type_id = (SELECT id FROM room_type WHERE slug = 'home-decor')
WHERE room_type_id IS NULL;

-- Verification queries to check the results
SELECT 
  rt.name as room_type,
  COUNT(p.id) as product_count
FROM room_type rt
LEFT JOIN products p ON rt.id = p.room_type_id
GROUP BY rt.id, rt.name
ORDER BY product_count DESC;

-- Check if any products still have NULL room_type_id
SELECT COUNT(*) as products_without_room_type FROM products WHERE room_type_id IS NULL;

-- Show some examples of assignments
SELECT 
  p.name as product_name,
  rt.name as room_type,
  c.name as category
FROM products p
LEFT JOIN room_type rt ON p.room_type_id = rt.id
LEFT JOIN categories c ON p.category_id = c.id
ORDER BY rt.name, p.name
LIMIT 20;
