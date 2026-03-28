import urllib.request as r
import json

req = r.Request(
    'http://127.0.0.1:8000/api/v1/auth/login', 
    data=json.dumps({'email': 'test2@gmail.com', 'password': 'test'}).encode(), 
    headers={'Content-Type': 'application/json'}
)
try:
    print(r.urlopen(req).read().decode())
except Exception as e:
    print("ERROR:", e)
    if hasattr(e, 'read'):
        print(e.read().decode())
