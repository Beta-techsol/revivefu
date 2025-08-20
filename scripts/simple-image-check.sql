-- Check current image URLs in products table
SELECT 
    id,
    name,
    images
FROM products 
WHERE images IS NOT NULL 
LIMIT 5;

-- Count products with old domain
SELECT COUNT(*) as products_with_old_domain
FROM products 
WHERE images::text LIKE '%revivefurniture.pk%';

-- Count total products with images
SELECT COUNT(*) as total_products_with_images
FROM products 
WHERE images IS NOT NULL AND images != '[]'::jsonb;
