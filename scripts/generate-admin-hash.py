import bcrypt
import os
import psycopg2
from urllib.parse import urlparse

# Generate the correct bcrypt hash for 'admin123'
password = 'admin123'
salt = bcrypt.gensalt(rounds=12)
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
hashed_str = hashed.decode('utf-8')

print(f"Generated hash: {hashed_str}")

# Verify the hash works
test_result = bcrypt.checkpw(password.encode('utf-8'), hashed)
print(f"Hash verification test: {test_result}")

# Connect to database and update
try:
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not found")
        exit(1)
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor()
    
    # Update the admin user password
    cur.execute("""
        UPDATE users 
        SET password_hash = %s
        WHERE email = 'admin@revivefurniture.com'
    """, (hashed_str,))
    
    # Verify the update
    cur.execute("""
        SELECT id, email, password_hash, is_admin, is_active 
        FROM users 
        WHERE email = 'admin@revivefurniture.com'
    """)
    
    result = cur.fetchone()
    if result:
        print(f"Updated admin user: ID={result[0]}, Email={result[1]}")
        print(f"New hash length: {len(result[2])}")
        print(f"Is admin: {result[3]}, Is active: {result[4]}")
        
        # Test the stored hash
        stored_hash = result[2].encode('utf-8')
        final_test = bcrypt.checkpw(password.encode('utf-8'), stored_hash)
        print(f"Final verification with stored hash: {final_test}")
    else:
        print("ERROR: Admin user not found!")
    
    conn.commit()
    cur.close()
    conn.close()
    
    print("SUCCESS: Admin password hash updated and verified!")
    
except Exception as e:
    print(f"ERROR: {str(e)}")
