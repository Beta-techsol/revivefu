-- First, let's check if the column exists
DO $$ 
DECLARE
    column_exists boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_status'
    ) INTO column_exists;
    
    IF NOT column_exists THEN
        -- Add the payment_status column
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid';
        RAISE NOTICE 'Added payment_status column to orders table';
        
        -- Update existing records based on their status
        UPDATE orders 
        SET payment_status = CASE 
            WHEN status = 'completed' OR status = 'delivered' THEN 'paid'
            WHEN status = 'cancelled' OR status = 'refunded' THEN 'refunded'
            WHEN status = 'processing' OR status = 'shipped' THEN 'pending'
            ELSE 'unpaid'
        END;
        
        RAISE NOTICE 'Updated existing orders with payment_status';
    ELSE
        RAISE NOTICE 'payment_status column already exists';
    END IF;
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
    CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    
    RAISE NOTICE 'Created/verified indexes on orders table';
END $$;
