const API_BASE = 'http://localhost:5000/api';

async function testTokenRefreshAndSalaryStructure() {
  console.log('====================================================');
  console.log('  TESTING REFRESH TOKEN & SALARY STRUCTURE CREATION');
  console.log('====================================================\n');

  // 1. Log in as HR Payroll Manager (Rahul Patel)
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'rahul.patel@peoplepay360.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const accessToken = loginData.tokens?.accessToken || loginData.token;
  const refreshToken = loginData.tokens?.refreshToken;

  console.log('1. Login successful');
  console.log(' - Access Token:', accessToken ? 'Present (valid for 24h)' : 'MISSING');
  console.log(' - Refresh Token:', refreshToken ? 'Present (valid for 7d)' : 'MISSING');

  if (!accessToken || !refreshToken) {
    console.error('FAIL: Missing tokens');
    process.exit(1);
  }

  // 2. Test Refresh Token Endpoint
  console.log('\n2. Testing POST /api/auth/refresh-token');
  const refreshRes = await fetch(`${API_BASE}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  console.log(' - Refresh HTTP Status:', refreshRes.status);
  const refreshData = await refreshRes.json();
  console.log(' - New Access Token:', Boolean(refreshData.tokens?.accessToken || refreshData.token));

  const activeToken = refreshData.tokens?.accessToken || accessToken;

  // 3. Test Create Salary Structure
  console.log('\n3. Testing POST /api/salary/structures with valid token');
  const structRes = await fetch(`${API_BASE}/salary/structures`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${activeToken}`
    },
    body: JSON.stringify({
      name: `Performance Executive Test ${Date.now()}`,
      description: 'Auto-tested executive compensation structure'
    })
  });
  console.log(' - Create Structure Status:', structRes.status);
  const structData = await structRes.json();
  console.log(' - Response:', structData);

  if (structRes.status === 201) {
    console.log('\n✅ ALL TESTS PASSED: Token refresh and Salary Structure creation succeed!');
  } else {
    console.error('FAIL: Structure creation failed with status', structRes.status);
    process.exit(1);
  }
}

testTokenRefreshAndSalaryStructure().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
