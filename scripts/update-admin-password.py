import os
import bcrypt
import psycopg2
from urllib.parse import urlparse

def update_admin_password():
    try:
        # Get database URL
        database_url = os.environ.get('DATABASE_URL')
        if not database_url:
            print("ERROR: DATABASE_URL not found")
            return
        
        # Parse the database URL
        parsed = urlparse(database_url)
        
        # Connect to database
        conn = psycopg2.connect(
            host=parsed.hostname,
            port=parsed.port,
            database=parsed.path[1:],  # Remove leading slash
            user=parsed.username,
            password=parsed.password,
            sslmode='require'
        )
        
        cursor = conn.cursor()
        
        # Generate correct password hash
        password = "betatech@p@$$"
        salt = bcrypt.gensalt(rounds=12)
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
        print(f"Generated new hash: {password_hash}")
        print(f"Hash length: {len(password_hash)}")
        
        # Update admin user password
        cursor.execute("""
            UPDATE admin_users 
            SET password_hash = %s
            WHERE email = 'admin@revivefurniture.com'
        """, (password_hash,))
        
        # Verify the update
        cursor.execute("""
            SELECT id, email, name, role, 
                   LENGTH(password_hash) as hash_length,
                   SUBSTRING(password_hash, 1, 10) as hash_prefix
            FROM admin_users 
            WHERE email = 'admin@revivefurniture.com'
        """)
        
        result = cursor.fetchone()
        if result:
            print(f"Updated admin user:")
            print(f"  ID: {result[0]}")
            print(f"  Email: {result[1]}")
            print(f"  Name: {result[2]}")
            print(f"  Role: {result[3]}")
            print(f"  Hash Length: {result[4]}")
            print(f"  Hash Prefix: {result[5]}")
        
        # Test the new password hash
        test_result = bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
        print(f"Password verification test: {test_result}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("SUCCESS: Admin password updated successfully!")
        
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    update_admin_password()
