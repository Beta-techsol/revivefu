-- Create test@mail.com as admin user
INSERT INTO admin_users (email, name, role, password_hash, is_active, created_at, updated_at)
VALUES (
  'test@mail.com',
  'Test Admin',
  'admin',
  '$2a$12$LQv3c1yqBWVHxkd0LQ4lqemeH.GQCbc4f69v76aaLUrkQUSBXuhFy', -- password: admin123
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  password_hash = EXCLUDED.password_hash,
  is_active = EXCLUDED.is_active,
  updated_at = CURRENT_TIMESTAMP;
