-- Add payment_status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'payment_status') THEN
        ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid';
    END IF;
END $$;

-- Update existing records to have proper payment status
UPDATE orders 
SET payment_status = CASE 
    WHEN status = 'completed' THEN 'paid'
    WHEN status = 'cancelled' THEN 'unpaid'
    ELSE 'unpaid'
END 
WHERE payment_status IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
