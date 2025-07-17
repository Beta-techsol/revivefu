-- Insert test user with verified status
INSERT INTO users (
  email, 
  password_hash, 
  first_name, 
  last_name, 
  phone, 
  email_verified, 
  is_active
) VALUES (
  'test@mail.com',
  '$2a$12$LQv3c1yqBwEHXLAw98j2uOe5UjHXvwy6FHMQJNkKtBDaqE.aco9wO', -- bcrypt hash of '123456789'
  'Test',
  'User',
  '+1234567890',
  true,
  true
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  email_verified = EXCLUDED.email_verified,
  is_active = EXCLUDED.is_active;
