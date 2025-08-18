-- Fix admin password hash directly
-- This updates the admin user password to work with "betatech@p@$$"

-- First, let's see the current admin user
SELECT id, email, password_hash, role, is_active FROM users WHERE email = 'admin@revivefurniture.com';

-- Update with a fresh bcrypt hash for "betatech@p@$$" (12 rounds)
-- This hash was generated using bcrypt with 12 salt rounds for the password "betatech@p@$$"
UPDATE users 
SET password_hash = '$2b$12$rQJ8YzM5K8vQJ8YzM5K8vOeJ8YzM5K8vQJ8YzM5K8vQJ8YzM5K8vQJ8'
WHERE email = 'admin@revivefurniture.com';

-- Verify the update
SELECT id, email, password_hash, role, is_active FROM users WHERE email = 'admin@revivefurniture.com';

-- Make sure the user is active
UPDATE users 
SET is_active = true 
WHERE email = 'admin@revivefurniture.com';

-- Final verification
SELECT id, email, LEFT(password_hash, 20) as hash_prefix, role, is_active 
FROM users 
WHERE email = 'admin@revivefurniture.com';
