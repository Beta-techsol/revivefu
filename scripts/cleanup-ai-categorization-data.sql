-- Cleanup AI Categorization Data
-- Removes old logs and backup data to keep database clean
-- Usage: Run periodically to clean up old AI categorization data

DO $$
DECLARE
    cleanup_date TIMESTAMP WITH TIME ZONE;
    deleted_logs INTEGER := 0;
    deleted_backups INTEGER := 0;
    deleted_sessions INTEGER := 0;
BEGIN
    -- Set cleanup date (keep data from last 90 days)
    cleanup_date := NOW() - INTERVAL '90 days';
    
    RAISE NOTICE 'Starting cleanup of AI categorization data older than: %', cleanup_date;
    
    -- Delete old categorization logs
    DELETE FROM categorization_logs 
    WHERE created_at < cleanup_date;
    
    GET DIAGNOSTICS deleted_logs = ROW_COUNT;
    
    -- Delete old product category backups
    DELETE FROM product_category_backups 
    WHERE backup_timestamp < cleanup_date;
    
    GET DIAGNOSTICS deleted_backups = ROW_COUNT;
    
    -- Delete old category backups
    DELETE FROM category_backups 
    WHERE backup_timestamp < cleanup_date;
    
    -- Delete old completed sessions (keep failed ones for debugging)
    DELETE FROM ai_categorization_sessions 
    WHERE started_at < cleanup_date 
    AND status IN ('completed', 'rolled_back');
    
    GET DIAGNOSTICS deleted_sessions = ROW_COUNT;
    
    RAISE NOTICE 'Cleanup completed successfully!';
    RAISE NOTICE 'Deleted logs: %', deleted_logs;
    RAISE NOTICE 'Deleted backups: %', deleted_backups;
    RAISE NOTICE 'Deleted sessions: %', deleted_sessions;
    
END $$;

-- Query to check current data volume
SELECT 
    'categorization_logs' as table_name,
    COUNT(*) as record_count,
    MIN(created_at) as oldest_record,
    MAX(created_at) as newest_record
FROM categorization_logs
UNION ALL
SELECT 
    'product_category_backups' as table_name,
    COUNT(*) as record_count,
    MIN(backup_timestamp) as oldest_record,
    MAX(backup_timestamp) as newest_record
FROM product_category_backups
UNION ALL
SELECT 
    'ai_categorization_sessions' as table_name,
    COUNT(*) as record_count,
    MIN(started_at) as oldest_record,
    MAX(started_at) as newest_record
FROM ai_categorization_sessions;
