from app.core.security import get_password_hash
import sys
try:
    print("Hashing 'test'...")
    res = get_password_hash("test")
    print("Hash length:", len(res))
except Exception as e:
    print("ERROR:", e)
    sys.exit(1)
