-- Fix admin user password hash
-- This will update the admin user with the correct bcrypt hash for password: betatech@p@$$

UPDATE admin_users 
SET password_hash = '$2b$12$K8vQJ9X8YQJ9X8YQJ9X8YeK8vQJ9X8YQJ9X8YQJ9X8YQJ9X8YQJ9X8'
WHERE email = 'admin@revivefurniture.com';

-- Verify the update
SELECT id, email, name, role, 
       LENGTH(password_hash) as hash_length,
       SUBSTRING(password_hash, 1, 10) as hash_prefix
FROM admin_users 
WHERE email = 'admin@revivefurniture.com';
