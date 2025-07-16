-- Add payment_status column to orders table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid';
        
        -- Update existing records based on status
        UPDATE orders 
        SET payment_status = CASE 
            WHEN status = 'completed' THEN 'paid'
            WHEN status = 'cancelled' THEN 'refunded'
            WHEN status IN ('pending', 'processing') THEN 'pending'
            ELSE 'unpaid'
        END
        WHERE payment_status IS NULL OR payment_status = 'unpaid';
        
        RAISE NOTICE 'Added payment_status column to orders table';
    ELSE
        RAISE NOTICE 'payment_status column already exists in orders table';
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
