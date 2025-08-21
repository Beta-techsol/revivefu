-- Create junction table for many-to-many product-category relationships
CREATE TABLE IF NOT EXISTS product_categories (
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, category_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);

-- Migrate existing product-category relationships
INSERT INTO product_categories (product_id, category_id)
SELECT id, category_id 
FROM products 
WHERE category_id IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Update the categories route to use the junction table for product counts
-- Note: We'll keep the category_id column for now for backward compatibility
-- but the junction table will be the source of truth for category assignments
