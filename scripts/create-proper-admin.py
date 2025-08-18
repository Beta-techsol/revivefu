import os
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor

def create_admin_user():
    try:
        # Get database connection
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Admin credentials
        email = 'admin@revivefurniture.com'
        password = 'betatech@p@$$'
        name = 'Admin User'
        role = 'super_admin'
        
        # Hash the password with bcrypt (12 salt rounds to match the auth system)
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')
        
        print(f"Creating admin user: {email}")
        print(f"Password hash: {password_hash}")
        
        # Delete existing admin user if exists
        cursor.execute("DELETE FROM admin_users WHERE email = %s", (email,))
        deleted_count = cursor.rowcount
        if deleted_count > 0:
            print(f"Deleted {deleted_count} existing admin user(s)")
        
        # Insert new admin user
        cursor.execute("""
            INSERT INTO admin_users (email, password_hash, name, role, is_active)
            VALUES (%s, %s, %s, %s, %s)
        """, (email, password_hash, name, role, True))
        
        # Verify the insertion
        cursor.execute("SELECT email, name, role, is_active, created_at FROM admin_users WHERE email = %s", (email,))
        admin_user = cursor.fetchone()
        
        if admin_user:
            print("✅ Admin user created successfully!")
            print(f"Email: {admin_user['email']}")
            print(f"Name: {admin_user['name']}")
            print(f"Role: {admin_user['role']}")
            print(f"Active: {admin_user['is_active']}")
            print(f"Created: {admin_user['created_at']}")
        else:
            print("❌ Failed to create admin user")
            
        # Commit the transaction
        conn.commit()
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    create_admin_user()
