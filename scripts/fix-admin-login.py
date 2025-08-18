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
    
    # Admin credentials
    admin_email = "admin@revivefurniture.com"
    admin_password = "betatech@p@$$"
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        print("🔐 Fixing admin login...")
        print(f"📧 Email: {admin_email}")
        print(f"🔑 Password: {admin_password}")
        
        # Generate new bcrypt hash with 12 rounds (same as auth system)
        password_bytes = admin_password.encode('utf-8')
        salt = bcrypt.gensalt(rounds=12)
        hashed_password = bcrypt.hashpw(password_bytes, salt)
        hashed_password_str = hashed_password.decode('utf-8')
        
        print(f"🔒 Generated hash: {hashed_password_str[:20]}...")
        print(f"📏 Hash length: {len(hashed_password_str)}")
        
        # Verify the hash works before updating database
        verification_result = bcrypt.checkpw(password_bytes, hashed_password)
        print(f"✅ Hash verification test: {verification_result}")
        
        if not verification_result:
            print("❌ Hash verification failed! Something is wrong.")
            return
        
        # Update the admin user's password
        cursor.execute("""
            UPDATE users 
            SET password_hash = %s, updated_at = NOW()
            WHERE email = %s AND role = 'admin'
        """, (hashed_password_str, admin_email))
        
        rows_affected = cursor.rowcount
        print(f"📝 Updated {rows_affected} admin user(s)")
        
        if rows_affected == 0:
            print("⚠️  No admin user found to update")
            return
        
        # Commit the changes
        conn.commit()
        
        # Verify the update worked
        cursor.execute("""
            SELECT id, email, password_hash, role, is_active
            FROM users 
            WHERE email = %s AND role = 'admin'
        """, (admin_email,))
        
        admin_user = cursor.fetchone()
        if admin_user:
            print(f"✅ Admin user verified:")
            print(f"   ID: {admin_user['id']}")
            print(f"   Email: {admin_user['email']}")
            print(f"   Role: {admin_user['role']}")
            print(f"   Active: {admin_user['is_active']}")
            print(f"   Hash: {admin_user['password_hash'][:20]}...")
            
            # Final verification test
            stored_hash = admin_user['password_hash'].encode('utf-8')
            final_test = bcrypt.checkpw(password_bytes, stored_hash)
            print(f"🔐 Final login test: {final_test}")
            
            if final_test:
                print("🎉 SUCCESS! Admin login should now work!")
                print(f"🔑 Use: {admin_email} / {admin_password}")
            else:
                print("❌ FAILED! Something went wrong with the password update.")
        else:
            print("❌ Could not find updated admin user")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    main()
