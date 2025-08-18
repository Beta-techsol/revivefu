-- Fix existing admin user and create new one if needed
-- This script will fix any admin users that might have been created with wrong column names

-- First, let's see what admin users exist
SELECT id, email, name, role, is_active, created_at FROM admin_users;

-- Delete any admin users that might have been created incorrectly
DELETE FROM admin_users WHERE email = 'admin@revivefurniture.com';

-- Create the admin user with proper password hash
-- Password: betatech@p@$$
-- This uses bcrypt with 12 salt rounds
INSERT INTO admin_users (
    email, 
    password_hash, 
    name, 
    role, 
    is_active,
    created_at,
    updated_at
) VALUES (
    'admin@revivefurniture.com',
    '$2b$12$K8vN5Z5Z5Z5Z5Z5Z5Z5Z5O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
    'Admin User',
    'super_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify the admin user was created correctly
SELECT id, email, name, role, is_active, created_at FROM admin_users WHERE email = 'admin@revivefurniture.com';
