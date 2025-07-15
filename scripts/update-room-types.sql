-- Drop existing room_type table if it exists and recreate with new structure
DROP TABLE IF EXISTS room_type CASCADE;

-- Create room_type table
CREATE TABLE room_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Update products table to use room_type_id instead of room_type string
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS room_type_id INTEGER REFERENCES room_type(id),
ADD COLUMN IF NOT EXISTS temp_room_type VARCHAR(100);

-- Migrate existing room_type data to new structure
UPDATE products SET temp_room_type = room_type WHERE room_type IS NOT NULL;

-- Map old room types to new ones
UPDATE products SET room_type_id = (SELECT id FROM room_type WHERE slug = 'living-room') WHERE temp_room_type = 'living_room' OR temp_room_type = 'living-room';
UPDATE products SET room_type_id = (SELECT id FROM room_type WHERE slug = 'bed-room') WHERE temp_room_type = 'bedroom' OR temp_room_type = 'bed-room';
UPDATE products SET room_type_id = (SELECT id FROM room_type WHERE slug = 'dining-room') WHERE temp_room_type = 'dining_room' OR temp_room_type = 'dining-room';
UPDATE products SET room_type_id = (SELECT id FROM room_type WHERE slug = 'office') WHERE temp_room_type = 'office';
UPDATE products SET room_type_id = (SELECT id FROM room_type WHERE slug = 'kitchen') WHERE temp_room_type = 'kitchen';

-- Drop the old room_type column and temp column
ALTER TABLE products DROP COLUMN IF EXISTS room_type;
ALTER TABLE products DROP COLUMN IF EXISTS temp_room_type;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_room_type_id ON products(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_type_slug ON room_type(slug);
