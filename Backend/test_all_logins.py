import requests
import json

test_cases = [
    {'email': 'adi@gmail.com', 'password': 'password123', 'expected_role': 'student'},
    {'email': 'f@gmail.com', 'password': 'password123', 'expected_role': 'faculty'},
    {'email': 'admin@campusmate.com', 'password': 'password123', 'expected_role': 'admin'},
    {'email': 'jayditya.0832cs221089@cdgi.edu.in', 'password': 'TempPass!2026', 'expected_role': 'student'},
]

print('🔐 TESTING LOGIN FOR MULTIPLE USERS:\n')

for test in test_cases:
    response = requests.post(
        'http://localhost:8000/api/login/',
        json={'email': test['email'], 'password': test['password']},
        headers={'Content-Type': 'application/json'}
    )
    
    success = response.status_code == 200
    resp_json = response.json()
    
    status_icon = '✅' if success else '❌'
    print(f'{status_icon} {test["email"]}')
    
    if success:
        print(f'   Role: {resp_json.get("role")} (expected: {test["expected_role"]})')
        print(f'   Name: {resp_json.get("first_name")} {resp_json.get("last_name")}')
        print(f'   Token: {resp_json.get("access")[:20]}...')
    else:
        print(f'   Error: {resp_json.get("error")}')
    print()

print('✅ All login tests completed!')
