-- Check if admin users exist and their details
SELECT id, email, name, role, is_active, created_at, last_login 
FROM admin_users 
WHERE email = 'admin@revivefurniture.com';

-- Check all admin users
SELECT id, email, name, role, is_active, created_at, last_login 
FROM admin_users;

-- Check if the admin_users table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'admin_users' 
ORDER BY ordinal_position;
