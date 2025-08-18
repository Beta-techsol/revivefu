-- AI Categorization Reporting Queries
-- Provides insights into AI categorization performance and results

-- Session Summary Report
SELECT 
    s.id as session_id,
    s.session_type,
    s.status,
    s.total_products,
    s.processed_products,
    s.successful_categorizations,
    s.failed_categorizations,
    s.new_categories_created,
    s.average_confidence,
    s.started_at,
    s.completed_at,
    EXTRACT(EPOCH FROM (s.completed_at - s.started_at)) / 60 as duration_minutes,
    au.name as created_by_user
FROM ai_categorization_sessions s
LEFT JOIN admin_users au ON s.created_by = au.id
WHERE s.session_type IN ('dry_run', 'apply')
ORDER BY s.started_at DESC
LIMIT 20;

-- Confidence Distribution Report
SELECT 
    CASE 
        WHEN confidence >= 90 THEN '90-100% (Excellent)'
        WHEN confidence >= 80 THEN '80-89% (High)'
        WHEN confidence >= 70 THEN '70-79% (Good)'
        WHEN confidence >= 60 THEN '60-69% (Medium)'
        WHEN confidence >= 50 THEN '50-59% (Low)'
        ELSE 'Below 50% (Poor)'
    END as confidence_range,
    COUNT(*) as product_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM categorization_logs
WHERE action = 'analyzed' 
AND confidence IS NOT NULL
AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY 
    CASE 
        WHEN confidence >= 90 THEN '90-100% (Excellent)'
        WHEN confidence >= 80 THEN '80-89% (High)'
        WHEN confidence >= 70 THEN '70-79% (Good)'
        WHEN confidence >= 60 THEN '60-69% (Medium)'
        WHEN confidence >= 50 THEN '50-59% (Low)'
        ELSE 'Below 50% (Poor)'
    END
ORDER BY MIN(confidence) DESC;

-- Category Changes Report
SELECT 
    c_old.name as old_category,
    c_new.name as new_category,
    COUNT(*) as products_moved,
    AVG(cl.confidence) as avg_confidence
FROM categorization_logs cl
LEFT JOIN categories c_old ON cl.old_category_id = c_old.id
LEFT JOIN categories c_new ON cl.new_category_id = c_new.id
WHERE cl.action = 'categorized'
AND cl.dry_run = FALSE
AND cl.created_at >= NOW() - INTERVAL '30 days'
GROUP BY c_old.name, c_new.name
ORDER BY products_moved DESC
LIMIT 20;

-- New Categories Created Report
SELECT 
    cb.category_name,
    cb.category_description,
    COUNT(p.id) as products_assigned,
    cb.backup_timestamp as created_at
FROM category_backups cb
LEFT JOIN categories c ON cb.category_id = c.id
LEFT JOIN products p ON p.category_id = c.id
WHERE cb.created_during_session = TRUE
AND cb.backup_timestamp >= NOW() - INTERVAL '30 days'
GROUP BY cb.category_name, cb.category_description, cb.backup_timestamp
ORDER BY products_assigned DESC;

-- Error Analysis Report
SELECT 
    DATE_TRUNC('day', created_at) as error_date,
    COUNT(*) as error_count,
    STRING_AGG(DISTINCT SUBSTRING(error_message, 1, 100), '; ') as sample_errors
FROM categorization_logs
WHERE action = 'error'
AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY error_date DESC;

-- Performance Metrics Report
SELECT 
    DATE_TRUNC('week', started_at) as week_starting,
    COUNT(*) as sessions_run,
    AVG(total_products) as avg_products_per_session,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) as avg_duration_minutes,
    AVG(average_confidence) as avg_confidence_score,
    SUM(new_categories_created) as total_new_categories
FROM ai_categorization_sessions
WHERE session_type = 'apply'
AND status = 'completed'
AND started_at >= NOW() - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', started_at)
ORDER BY week_starting DESC;
