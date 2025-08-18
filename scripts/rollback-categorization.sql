-- Rollback AI Categorization Changes
-- Restores product categories to their state before AI changes
-- Usage: Replace 'YOUR_SESSION_ID_HERE' with the actual session ID to rollback

DO $$
DECLARE
    target_session_id UUID := 'YOUR_SESSION_ID_HERE'; -- Replace with actual session ID
    rollback_session_id UUID;
    backup_record RECORD;
    category_record RECORD;
    rollback_count INTEGER := 0;
    categories_removed INTEGER := 0;
BEGIN
    -- Validate the target session exists and was successful
    IF NOT EXISTS (
        SELECT 1 FROM ai_categorization_sessions 
        WHERE id = target_session_id 
        AND session_type = 'apply' 
        AND status = 'completed'
    ) THEN
        RAISE EXCEPTION 'Invalid session ID or session was not a completed apply operation';
    END IF;
    
    -- Generate rollback session ID
    rollback_session_id := gen_random_uuid();
    
    RAISE NOTICE 'Starting rollback for session: %', target_session_id;
    RAISE NOTICE 'Rollback session ID: %', rollback_session_id;
    
    -- Create rollback session record
    INSERT INTO ai_categorization_sessions (
        id,
        session_type,
        status,
        started_at,
        metadata
    ) VALUES (
        rollback_session_id,
        'rollback',
        'running',
        NOW(),
        jsonb_build_object('target_session_id', target_session_id)
    );
    
    -- Restore products to their original categories
    FOR backup_record IN
        SELECT 
            product_id,
            original_category_id,
            original_category_name
        FROM product_category_backups
        WHERE session_id = target_session_id
    LOOP
        -- Update product back to original category
        UPDATE products 
        SET 
            category_id = backup_record.original_category_id,
            updated_at = NOW()
        WHERE id = backup_record.product_id;
        
        -- Log the rollback action
        INSERT INTO categorization_logs (
            session_id,
            product_id,
            action,
            old_category_id,
            new_category_id,
            dry_run,
            metadata
        ) VALUES (
            rollback_session_id,
            backup_record.product_id,
            'rollback',
            (SELECT category_id FROM products WHERE id = backup_record.product_id),
            backup_record.original_category_id,
            FALSE,
            jsonb_build_object('rollback_from_session', target_session_id)
        );
        
        rollback_count := rollback_count + 1;
    END LOOP;
    
    -- Remove categories that were created during the AI session (optional)
    -- Uncomment the following block if you want to remove AI-created categories
    /*
    FOR category_record IN
        SELECT category_id, category_name
        FROM category_backups
        WHERE session_id = target_session_id
        AND created_during_session = TRUE
    LOOP
        -- Check if category is still in use by other products
        IF NOT EXISTS (
            SELECT 1 FROM products 
            WHERE category_id = category_record.category_id
        ) THEN
            DELETE FROM categories WHERE id = category_record.category_id;
            categories_removed := categories_removed + 1;
            
            RAISE NOTICE 'Removed unused AI-created category: %', category_record.category_name;
        ELSE
            RAISE NOTICE 'Kept AI-created category (still in use): %', category_record.category_name;
        END IF;
    END LOOP;
    */
    
    -- Mark original session as rolled back
    UPDATE ai_categorization_sessions 
    SET status = 'rolled_back'
    WHERE id = target_session_id;
    
    -- Complete rollback session
    UPDATE ai_categorization_sessions 
    SET 
        status = 'completed',
        completed_at = NOW(),
        processed_products = rollback_count,
        metadata = metadata || jsonb_build_object('categories_removed', categories_removed)
    WHERE id = rollback_session_id;
    
    RAISE NOTICE 'Rollback completed successfully!';
    RAISE NOTICE 'Products restored: %', rollback_count;
    RAISE NOTICE 'Categories removed: %', categories_removed;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Update rollback session with error
        UPDATE ai_categorization_sessions 
        SET 
            status = 'failed',
            completed_at = NOW(),
            error_message = SQLERRM
        WHERE id = rollback_session_id;
        
        RAISE EXCEPTION 'Rollback failed: %', SQLERRM;
END $$;
