-- Check current product images to see if migration worked
SELECT 
    id,
    name,
    images,
    CASE 
        WHEN images::text LIKE '%revivefurniture.pk%' THEN 'OLD_DOMAIN'
        WHEN images::text LIKE '%cloudinary.com%' THEN 'CLOUDINARY'
        ELSE 'OTHER'
    END as image_source
FROM products 
WHERE images IS NOT NULL 
LIMIT 10;

-- Count products by image source
SELECT 
    CASE 
        WHEN images::text LIKE '%revivefurniture.pk%' THEN 'OLD_DOMAIN'
        WHEN images::text LIKE '%cloudinary.com%' THEN 'CLOUDINARY'
        ELSE 'OTHER'
    END as image_source,
    COUNT(*) as count
FROM products 
WHERE images IS NOT NULL
GROUP BY 
    CASE 
        WHEN images::text LIKE '%revivefurniture.pk%' THEN 'OLD_DOMAIN'
        WHEN images::text LIKE '%cloudinary.com%' THEN 'CLOUDINARY'
        ELSE 'OTHER'
    END;

-- Check categories with old domain images
SELECT id, name, image_url
FROM categories 
WHERE image_url LIKE '%revivefurniture.pk%'
LIMIT 5;

-- Check product variants with old domain images  
SELECT id, product_id, image_url
FROM product_variants 
WHERE image_url LIKE '%revivefurniture.pk%'
LIMIT 5;
