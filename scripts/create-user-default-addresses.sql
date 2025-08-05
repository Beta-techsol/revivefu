-- Create user default addresses table
CREATE TABLE IF NOT EXISTS user_default_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    address_type VARCHAR(20) NOT NULL CHECK (address_type IN ('billing', 'shipping')),
    is_default BOOLEAN DEFAULT false,
    
    -- Address fields matching orders table structure
    customer_name VARCHAR(255) NOT NULL,
    customer_company VARCHAR(255),
    customer_address TEXT NOT NULL,
    customer_address_line_2 TEXT,
    customer_city VARCHAR(100) NOT NULL,
    customer_state VARCHAR(100),
    customer_zip VARCHAR(20) NOT NULL,
    customer_country VARCHAR(100) DEFAULT 'Pakistan',
    customer_phone VARCHAR(20),
    customer_landmark VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_default_addresses_user_id ON user_default_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_default_addresses_type ON user_default_addresses(address_type);
CREATE INDEX IF NOT EXISTS idx_user_default_addresses_default ON user_default_addresses(is_default);

-- Create unique constraint for default addresses per type per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_default_addresses_unique_default 
ON user_default_addresses(user_id, address_type) 
WHERE is_default = true;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_default_addresses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_default_addresses_updated_at ON user_default_addresses;
CREATE TRIGGER trigger_update_user_default_addresses_updated_at
    BEFORE UPDATE ON user_default_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_user_default_addresses_updated_at();
