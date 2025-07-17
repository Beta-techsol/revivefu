-- Insert sample users for testing
INSERT INTO users (
    email, 
    password_hash, 
    first_name, 
    last_name, 
    phone, 
    email_verified, 
    is_active
) VALUES
(
    'john.doe@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- password: password123
    'John',
    'Doe',
    '+92 300 1234567',
    true,
    true
),
(
    'jane.smith@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- password: password123
    'Jane',
    'Smith',
    '+92 300 7654321',
    true,
    true
),
(
    'sarah.johnson@example.com',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- password: password123
    'Sarah',
    'Johnson',
    '+92 300 1122334',
    true,
    true
)
ON CONFLICT (email) DO NOTHING;
