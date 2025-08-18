import os
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor

def main():
    # Get database connection
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL environment variable not found")
        return
    
    # Get admin credentials from environment
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@revivefurniture.com')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    print(f"🔧 Fixing admin password for: {admin_email}")
    print(f"🔑 Using password: {admin_password}")
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Generate proper bcrypt hash
        password_bytes = admin_password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        hashed_password_str = hashed_password.decode('utf-8')
        
        print(f"✅ Generated hash: {hashed_password_str[:20]}...")
        print(f"📏 Hash length: {len(hashed_password_str)}")
        
        # Verify the hash works
        verification_result = bcrypt.checkpw(password_bytes, hashed_password)
        print(f"🔍 Hash verification test: {'✅ PASS' if verification_result else '❌ FAIL'}")
        
        if not verification_result:
            print("❌ Hash generation failed verification!")
            return
        
        # Check if admin user exists
        cursor.execute("SELECT id, email, password_hash FROM users WHERE email = %s", (admin_email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            print(f"👤 Found existing admin user with ID: {existing_user['id']}")
            print(f"🔍 Current hash length: {len(existing_user['password_hash']) if existing_user['password_hash'] else 0}")
            
            # Update the password hash
            cursor.execute(
                "UPDATE users SET password_hash = %s, is_active = true WHERE email = %s",
                (hashed_password_str, admin_email)
            )
            print("✅ Updated existing admin user password")
        else:
            # Create new admin user
            cursor.execute("""
                INSERT INTO users (email, password_hash, first_name, last_name, is_active, role, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
            """, (admin_email, hashed_password_str, 'Admin', 'User', True, 'admin'))
            print("✅ Created new admin user")
        
        # Commit changes
        conn.commit()
        
        # Verify the update worked
        cursor.execute("SELECT id, email, password_hash, is_active, role FROM users WHERE email = %s", (admin_email,))
        updated_user = cursor.fetchone()
        
        if updated_user:
            print(f"🎉 Final verification:")
            print(f"   - User ID: {updated_user['id']}")
            print(f"   - Email: {updated_user['email']}")
            print(f"   - Hash length: {len(updated_user['password_hash'])}")
            print(f"   - Is active: {updated_user['is_active']}")
            print(f"   - Role: {updated_user['role']}")
            
            # Test the stored hash
            stored_hash = updated_user['password_hash'].encode('utf-8')
            final_test = bcrypt.checkpw(password_bytes, stored_hash)
            print(f"   - Password test: {'✅ PASS' if final_test else '❌ FAIL'}")
            
            if final_test:
                print(f"\n🎉 SUCCESS! Admin login should now work with:")
                print(f"   Email: {admin_email}")
                print(f"   Password: {admin_password}")
            else:
                print(f"\n❌ FAILED! Password verification still not working")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()

if __name__ == "__main__":
    main()
