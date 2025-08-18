-- AI Categorization System Database Schema
-- Creates tables for logging, backups, and rollback functionality

-- Create categorization_logs table for tracking all AI operations
CREATE TABLE IF NOT EXISTS categorization_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    product_id INTEGER REFERENCES products(id),
    action VARCHAR(50) NOT NULL CHECK (action IN ('analyzed', 'categorized', 'created_category', 'error', 'backup', 'rollback')),
    old_category_id INTEGER REFERENCES categories(id),
    new_category_id INTEGER REFERENCES categories(id),
    suggested_category VARCHAR(255),
    confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
    reasoning TEXT,
    needs_new_category BOOLEAN DEFAULT FALSE,
    new_category_description TEXT,
    dry_run BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES admin_users(id)
);

-- Create product_category_backups table for rollback functionality
CREATE TABLE IF NOT EXISTS product_category_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    product_id INTEGER NOT NULL REFERENCES products(id),
    original_category_id INTEGER REFERENCES categories(id),
    original_category_name VARCHAR(255),
    backup_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES admin_users(id)
);

-- Create category_backups table for new categories created during AI categorization
CREATE TABLE IF NOT EXISTS category_backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    category_name VARCHAR(255) NOT NULL,
    category_description TEXT,
    category_slug VARCHAR(255),
    created_during_session BOOLEAN DEFAULT TRUE,
    backup_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by INTEGER REFERENCES admin_users(id)
);

-- Create ai_categorization_sessions table for tracking complete runs
CREATE TABLE IF NOT EXISTS ai_categorization_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('dry_run', 'apply', 'rollback')),
    status VARCHAR(20) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'rolled_back')),
    total_products INTEGER DEFAULT 0,
    processed_products INTEGER DEFAULT 0,
    successful_categorizations INTEGER DEFAULT 0,
    failed_categorizations INTEGER DEFAULT 0,
    new_categories_created INTEGER DEFAULT 0,
    average_confidence DECIMAL(5,2),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB,
    created_by INTEGER REFERENCES admin_users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categorization_logs_session_id ON categorization_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_categorization_logs_product_id ON categorization_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_categorization_logs_action ON categorization_logs(action);
CREATE INDEX IF NOT EXISTS idx_categorization_logs_created_at ON categorization_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_product_category_backups_session_id ON product_category_backups(session_id);
CREATE INDEX IF NOT EXISTS idx_product_category_backups_product_id ON product_category_backups(product_id);

CREATE INDEX IF NOT EXISTS idx_category_backups_session_id ON category_backups(session_id);
CREATE INDEX IF NOT EXISTS idx_category_backups_category_id ON category_backups(category_id);

CREATE INDEX IF NOT EXISTS idx_ai_categorization_sessions_status ON ai_categorization_sessions(status);
CREATE INDEX IF NOT EXISTS idx_ai_categorization_sessions_created_at ON ai_categorization_sessions(started_at);

-- Add comments for documentation
COMMENT ON TABLE categorization_logs IS 'Logs all AI categorization operations for audit and debugging';
COMMENT ON TABLE product_category_backups IS 'Backup of original product categories before AI changes for rollback';
COMMENT ON TABLE category_backups IS 'Backup of categories created during AI categorization sessions';
COMMENT ON TABLE ai_categorization_sessions IS 'Tracks complete AI categorization runs with statistics';

COMMENT ON COLUMN categorization_logs.session_id IS 'Links all operations in a single AI categorization run';
COMMENT ON COLUMN categorization_logs.confidence IS 'AI confidence score from 0-100';
COMMENT ON COLUMN categorization_logs.dry_run IS 'Whether this was a preview run or actual changes';

COMMENT ON COLUMN product_category_backups.session_id IS 'Session that created this backup';
COMMENT ON COLUMN product_category_backups.original_category_id IS 'Category ID before AI changes';

COMMENT ON COLUMN ai_categorization_sessions.session_type IS 'Type of session: dry_run, apply, or rollback';
COMMENT ON COLUMN ai_categorization_sessions.average_confidence IS 'Average AI confidence across all products';
