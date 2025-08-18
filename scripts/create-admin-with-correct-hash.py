import os
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor

def create_admin_user():
    # Get database connection
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not found")
        return
    
    # Admin credentials
    admin_email = "admin@revivefurniture.com"
    admin_password = "betatech@p@$$"
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if admin user already exists
        cursor.execute("SELECT id, email FROM admin_users WHERE email = %s", (admin_email,))
        existing_admin = cursor.fetchone()
        
        if existing_admin:
            print(f"🔄 Admin user {admin_email} already exists. Updating password...")
            
            # Hash the new password
            password_hash = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Update existing admin user with correct password hash
            cursor.execute("""
                UPDATE admin_users 
                SET password_hash = %s, updated_at = NOW()
                WHERE email = %s
            """, (password_hash, admin_email))
            
            print(f"✅ Updated admin user password for {admin_email}")
        else:
            print(f"🆕 Creating new admin user {admin_email}...")
            
            # Hash the password
            password_hash = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create new admin user
            cursor.execute("""
                INSERT INTO admin_users (email, password_hash, created_at, updated_at)
                VALUES (%s, %s, NOW(), NOW())
            """, (admin_email, password_hash))
            
            print(f"✅ Created admin user {admin_email}")
        
        # Commit the changes
        conn.commit()
        
        # Verify the admin user was created/updated correctly
        cursor.execute("SELECT id, email, created_at FROM admin_users WHERE email = %s", (admin_email,))
        admin_user = cursor.fetchone()
        
        if admin_user:
            print(f"🎉 Admin user verified in database:")
            print(f"   ID: {admin_user['id']}")
            print(f"   Email: {admin_user['email']}")
            print(f"   Created: {admin_user['created_at']}")
            print(f"\n🔑 You can now login with:")
            print(f"   Email: {admin_email}")
            print(f"   Password: {admin_password}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    create_admin_user()
