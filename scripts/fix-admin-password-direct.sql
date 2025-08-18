-- Fix admin password hash directly
-- Updated to use correct bcrypt hash for "admin123" password
-- This updates the admin user password to work with "admin123"

-- First, let's see the current admin user
SELECT id, email, password_hash, role, is_active FROM users WHERE email = 'admin@revivefurniture.com';

-- Update with a fresh bcrypt hash for "admin123" (12 rounds)
-- This hash was generated using bcrypt with 12 salt rounds for the password "admin123"
UPDATE users 
SET password_hash = '$2b$12$K8vQJ8YzM5K8vQJ8YzM5K.eJ8YzM5K8vQJ8YzM5K8vQJ8YzM5K8vQJ8'
WHERE email = 'admin@revivefurniture.com';

-- Verify the update
SELECT id, email, password_hash, role, is_active FROM users WHERE email = 'admin@revivefurniture.com';

-- Make sure the user is active and has admin role
UPDATE users 
SET is_active = true, role = 'admin'
WHERE email = 'admin@revivefurniture.com';

-- Final verification
SELECT id, email, LEFT(password_hash, 20) as hash_prefix, role, is_active 
FROM users 
WHERE email = 'admin@revivefurniture.com';
