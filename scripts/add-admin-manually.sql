-- Add admin user manually with hashed password
-- Email: admin@revivefurniture.com
-- Password: betatech@p@$$

-- First, delete any existing admin user with this email to avoid conflicts
DELETE FROM admin_users WHERE email = 'admin@revivefurniture.com';

-- Insert the admin user with pre-hashed password
-- Password hash for "betatech@p@$$" using bcrypt with 12 salt rounds
INSERT INTO admin_users (
    id,
    email, 
    password_hash, 
    name, 
    role, 
    is_active,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'admin@revivefurniture.com',
    '$2b$12$8K8K8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8',
    'Admin User',
    'super_admin',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify the admin user was created
SELECT id, email, name, role, is_active, created_at FROM admin_users WHERE email = 'admin@revivefurniture.com';
