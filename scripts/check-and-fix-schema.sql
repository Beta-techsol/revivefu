-- Check current table structures
SELECT 'orders' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY column_name;

SELECT 'products' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY column_name;

SELECT 'order_items' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'order_items' 
ORDER BY column_name;

-- Check if image_url column exists in products table
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'image_url'
) as image_url_exists;

-- Check if images column exists in products table
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'products' 
    AND column_name = 'images'
) as images_exists;

-- If image_url doesn't exist but images does, we're using the correct column
-- If neither exists, we need to add one

-- Sample data check
SELECT 
    p.id,
    p.name,
    p.sku,
    p.images,
    CASE 
        WHEN p.images IS NOT NULL THEN 
            CASE 
                WHEN p.images::text LIKE '[%' THEN 'JSON Array'
                ELSE 'String'
            END
        ELSE 'NULL'
    END as images_type
FROM products p 
LIMIT 5;
