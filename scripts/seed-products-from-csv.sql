-- First, let's create some sample categories that might be in the CSV
INSERT INTO categories (name, slug, description, is_active) VALUES
('Living Room', 'living-room', 'Living room furniture and accessories', true),
('Bedroom', 'bedroom', 'Bedroom furniture and accessories', true),
('Dining Room', 'dining-room', 'Dining room furniture and accessories', true),
('Office', 'office', 'Office furniture and workspace solutions', true),
('Gaming', 'gaming', 'Gaming furniture and accessories', true),
('Storage', 'storage', 'Storage solutions and organizers', true),
('Outdoor', 'outdoor', 'Outdoor and patio furniture', true),
('Kitchen', 'kitchen', 'Kitchen furniture and accessories', true),
('Bathroom', 'bathroom', 'Bathroom furniture and accessories', true),
('Kids', 'kids', 'Kids and children furniture', true),
('Sofas', 'sofas', 'Sofas and seating furniture', true),
('Chairs', 'chairs', 'Chairs and seating solutions', true),
('Tables', 'tables', 'Tables and surfaces', true),
('Beds', 'beds', 'Beds and bedroom furniture', true),
('Wardrobes', 'wardrobes', 'Wardrobes and storage solutions', true),
('Decor', 'decor', 'Home decor and accessories', true),
('Lighting', 'lighting', 'Lighting solutions and fixtures', true),
('Rugs', 'rugs', 'Rugs and floor coverings', true),
('Mirrors', 'mirrors', 'Mirrors and wall decor', true),
('Accessories', 'accessories', 'Home accessories and decor items', true)
ON CONFLICT (slug) DO NOTHING;

-- Create an admin user for testing (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role, is_active) VALUES
('admin@revivefurniture.com', '$2b$10$rQZ9QmZ9QmZ9QmZ9QmZ9QO', 'Admin User', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Update products table to ensure all required columns exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS room_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS material VARCHAR(100),
ADD COLUMN IF NOT EXISTS color VARCHAR(50),
ADD COLUMN IF NOT EXISTS brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS weight DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_trending ON products(is_trending);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Add some sample products to test the system
INSERT INTO products (
  name, description, short_description, sku, price, compare_price,
  category_id, stock_quantity, images, status,
  is_featured, is_trending, is_best_seller, is_hot_selling, is_deal_of_day, is_latest,
  room_type, material, color, brand, weight, tags,
  slug, meta_title, meta_description
) VALUES
(
  'Modern Sectional Sofa',
  'Comfortable 3-seat sectional sofa with premium fabric upholstery and sturdy wooden frame',
  'Premium sectional sofa with modern design',
  'SOF-001',
  129999.00,
  149999.00,
  (SELECT id FROM categories WHERE slug = 'living-room'),
  15,
  '["\/shop\/products\/sofa-1.jpg"]',
  'active',
  true, false, true, false, false, false,
  'living_room', 'Fabric', 'Gray', 'Revive', 45.5,
  '["Best Seller", "Featured"]'::jsonb,
  'modern-sectional-sofa',
  'Modern Sectional Sofa - Premium Quality',
  'Comfortable 3-seat sectional sofa with premium fabric upholstery'
),
(
  'Ergonomic Office Chair',
  'Professional ergonomic office chair with lumbar support and breathable mesh back',
  'Ergonomic office chair with lumbar support',
  'CHR-001',
  59999.00,
  NULL,
  (SELECT id FROM categories WHERE slug = 'office'),
  8,
  '["\/shop\/products\/chair-1.jpg"]',
  'active',
  false, true, false, false, false, false,
  'office', 'Mesh', 'Black', 'Revive', 12.3,
  '["Trending"]'::jsonb,
  'ergonomic-office-chair',
  'Ergonomic Office Chair - Professional Grade',
  'Professional ergonomic office chair with lumbar support'
)
ON CONFLICT (sku) DO NOTHING;
