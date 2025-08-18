import os
import bcrypt
import psycopg2
from datetime import datetime

# Get database connection from environment
DATABASE_URL = os.environ.get('DATABASE_URL')

if not DATABASE_URL:
    print("Error: DATABASE_URL environment variable not found")
    exit(1)

# Admin credentials
admin_email = "admin@revivefurniture.com"
admin_password = "betatech@p@$$"
admin_name = "Admin User"

try:
    # Connect to database
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Check if admin user already exists
    cur.execute("SELECT id FROM admin_users WHERE email = %s", (admin_email,))
    existing_user = cur.fetchone()
    
    if existing_user:
        print(f"Admin user with email {admin_email} already exists!")
    else:
        # Hash the password using bcrypt with 12 salt rounds (same as auth system)
        password_bytes = admin_password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        hashed_password_str = hashed_password.decode('utf-8')
        
        # Insert admin user
        cur.execute("""
            INSERT INTO admin_users (name, email, password, role, is_active, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            admin_name,
            admin_email, 
            hashed_password_str,
            'super_admin',
            True,
            datetime.now(),
            datetime.now()
        ))
        
        conn.commit()
        print(f"✅ Admin user created successfully!")
        print(f"Email: {admin_email}")
        print(f"Password: {admin_password}")
        print(f"Role: super_admin")
    
except Exception as e:
    print(f"❌ Error creating admin user: {e}")
    if conn:
        conn.rollback()
finally:
    if cur:
        cur.close()
    if conn:
        conn.close()
