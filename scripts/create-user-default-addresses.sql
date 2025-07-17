-- Create user default addresses table to store user's preferred addresses
CREATE TABLE IF NOT EXISTS user_default_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('shipping', 'billing')),
    
    -- Address fields matching orders table structure
    customer_name VARCHAR(255),
    customer_company VARCHAR(255),
    customer_address TEXT,
    customer_address_line_2 TEXT,
    customer_city VARCHAR(100),
    customer_state VARCHAR(100),
    customer_zip VARCHAR(20),
    customer_country VARCHAR(100) DEFAULT 'Pakistan',
    customer_phone VARCHAR(20),
    customer_landmark VARCHAR(255),
    
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, address_type, is_default) DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_default_addresses_user_id ON user_default_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_default_addresses_type ON user_default_addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_user_default_addresses_default ON user_default_addresses(is_default) WHERE is_default = true;

-- Add foreign key constraint if users table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE user_default_addresses 
        ADD CONSTRAINT fk_user_default_addresses_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;
