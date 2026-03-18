import requests
import json

response = requests.post(
    'http://localhost:8000/api/login/',
    json={'email': 'adi@gmail.com', 'password': 'password123'},
    headers={'Content-Type': 'application/json'}
)
print(f'Status: {response.status_code}')
resp_json = response.json()
if response.status_code == 200:
    print('✅ LOGIN SUCCESS!')
    print(f'User: {resp_json.get("email")}')
    print(f'Role: {resp_json.get("role")}')
    print(f'Access Token obtained: {"access" in resp_json}')
else:
    print(f'❌ LOGIN FAILED: {resp_json.get("error")}')
