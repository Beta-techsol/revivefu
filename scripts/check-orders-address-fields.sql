-- Check and add missing address fields to orders table
DO $$ 
BEGIN
    -- Add billing address fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_name') THEN
        ALTER TABLE orders ADD COLUMN billing_name VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_company') THEN
        ALTER TABLE orders ADD COLUMN billing_company VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_address') THEN
        ALTER TABLE orders ADD COLUMN billing_address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_address_line_2') THEN
        ALTER TABLE orders ADD COLUMN billing_address_line_2 TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_city') THEN
        ALTER TABLE orders ADD COLUMN billing_city VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_state') THEN
        ALTER TABLE orders ADD COLUMN billing_state VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_zip') THEN
        ALTER TABLE orders ADD COLUMN billing_zip VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_country') THEN
        ALTER TABLE orders ADD COLUMN billing_country VARCHAR(100) DEFAULT 'Pakistan';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_phone') THEN
        ALTER TABLE orders ADD COLUMN billing_phone VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'billing_landmark') THEN
        ALTER TABLE orders ADD COLUMN billing_landmark VARCHAR(255);
    END IF;
    
    -- Add missing shipping address fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_company') THEN
        ALTER TABLE orders ADD COLUMN customer_company VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_address_line_2') THEN
        ALTER TABLE orders ADD COLUMN customer_address_line_2 TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_state') THEN
        ALTER TABLE orders ADD COLUMN customer_state VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_country') THEN
        ALTER TABLE orders ADD COLUMN customer_country VARCHAR(100) DEFAULT 'Pakistan';
    END IF;
END $$;

-- Update existing orders to have customer_name if missing
UPDATE orders 
SET customer_name = COALESCE(customer_name, 'Customer')
WHERE customer_name IS NULL OR customer_name = '';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
