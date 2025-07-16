-- Add payment_status column to orders table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid';
        
        -- Update existing records based on status
        UPDATE orders SET payment_status = 'paid' WHERE status = 'delivered';
        UPDATE orders SET payment_status = 'pending' WHERE status IN ('processing', 'shipped');
        UPDATE orders SET payment_status = 'unpaid' WHERE status = 'pending';
        
        COMMIT;
        
        RAISE NOTICE 'payment_status column added successfully';
    ELSE
        RAISE NOTICE 'payment_status column already exists';
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
