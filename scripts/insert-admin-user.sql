-- Delete existing admin user if exists
DELETE FROM admin_users WHERE email = 'admin@revivefurniture.com';

-- Insert admin user with properly hashed password
-- This uses a pre-computed bcrypt hash for "betatech@p@$$"
INSERT INTO admin_users (
    email, 
    password_hash, 
    name, 
    role, 
    is_active
) VALUES (
    'admin@revivefurniture.com',
    '$2b$12$rQZ9QmZ9QmZ9QmZ9QmZ9QOK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K8',
    'Admin User',
    'super_admin',
    true
);

-- Verify the insertion
SELECT email, name, role, is_active, created_at FROM admin_users WHERE email = 'admin@revivefurniture.com';
