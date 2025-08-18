-- Backup Product Categories Script
-- Creates a complete backup of current product categories before AI changes
-- Usage: Run this before applying AI categorization changes

DO $$
DECLARE
    backup_session_id UUID;
    product_record RECORD;
    category_record RECORD;
    backup_count INTEGER := 0;
BEGIN
    -- Generate a new session ID for this backup
    backup_session_id := gen_random_uuid();
    
    RAISE NOTICE 'Starting product category backup with session ID: %', backup_session_id;
    
    -- Create session record
    INSERT INTO ai_categorization_sessions (
        id, 
        session_type, 
        status, 
        started_at,
        metadata
    ) VALUES (
        backup_session_id,
        'backup',
        'running',
        NOW(),
        jsonb_build_object('backup_type', 'pre_ai_categorization')
    );
    
    -- Backup all products with their current categories
    FOR product_record IN 
        SELECT 
            p.id,
            p.category_id,
            c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
    LOOP
        INSERT INTO product_category_backups (
            session_id,
            product_id,
            original_category_id,
            original_category_name,
            backup_timestamp
        ) VALUES (
            backup_session_id,
            product_record.id,
            product_record.category_id,
            product_record.category_name,
            NOW()
        );
        
        backup_count := backup_count + 1;
    END LOOP;
    
    -- Update session with completion info
    UPDATE ai_categorization_sessions 
    SET 
        status = 'completed',
        completed_at = NOW(),
        total_products = backup_count,
        processed_products = backup_count
    WHERE id = backup_session_id;
    
    RAISE NOTICE 'Backup completed successfully!';
    RAISE NOTICE 'Session ID: %', backup_session_id;
    RAISE NOTICE 'Products backed up: %', backup_count;
    RAISE NOTICE 'Use this session ID for rollback if needed';
    
EXCEPTION
    WHEN OTHERS THEN
        -- Update session with error info
        UPDATE ai_categorization_sessions 
        SET 
            status = 'failed',
            completed_at = NOW(),
            error_message = SQLERRM
        WHERE id = backup_session_id;
        
        RAISE EXCEPTION 'Backup failed: %', SQLERRM;
END $$;

-- Query to view recent backups
SELECT 
    id as session_id,
    session_type,
    status,
    total_products,
    started_at,
    completed_at,
    EXTRACT(EPOCH FROM (completed_at - started_at)) as duration_seconds
FROM ai_categorization_sessions 
WHERE session_type IN ('backup', 'apply')
ORDER BY started_at DESC 
LIMIT 10;
