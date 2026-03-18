import requests

print('=' * 60)
print('LOGIN ENDPOINT TEST RESULTS')
print('=' * 60)

tests = [
    ('Student (adi@gmail.com)', 'adi@gmail.com', 'password123'),
    ('Faculty (f@gmail.com)', 'f@gmail.com', 'password123'),
    ('Admin (admin@campusmate.com)', 'admin@campusmate.com', 'password123'),
    ('Special (jayditya)', 'jayditya.0832cs221089@cdgi.edu.in', 'TempPass!2026'),
]

all_passed = True

for desc, email, pwd in tests:
    resp = requests.post(
        'http://localhost:8000/api/login/',
        json={'email': email, 'password': pwd}
    )
    passed = resp.status_code == 200
    all_passed = all_passed and passed
    
    print(f'\n{desc}')
    print(f'  Status: {resp.status_code}')
    if passed:
        data = resp.json()
        print(f'  ✅ SUCCESS')
        print(f'  Email: {data.get("email")}')
        print(f'  Role: {data.get("role")}')
        print(f'  Token: {data.get("access", "")[:30]}...')
    else:
        print(f'  ❌ FAILED')
        print(f'  Error: {resp.json().get("error")}')

print('\n' + '=' * 60)
if all_passed:
    print('✅ ALL TESTS PASSED - LOGIN IS WORKING!')
else:
    print('❌ SOME TESTS FAILED')
print('=' * 60)
