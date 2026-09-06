const API_BASE = 'http://localhost:5000/api';

async function testRankingsSuite() {
  console.log('====================================================');
  console.log('  TESTING TOP 5 EMPLOYEE RANKINGS ENDPOINT SUITE');
  console.log('====================================================\n');

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return { token: data.token || data.access_token, user: data.user };
  }

  const empLogin = await login('priya.shah@peoplepay360.com', 'password123');
  const hrLogin = await login('amit.shah@peoplepay360.com', 'password123');
  const adminLogin = await login('admin@peoplepay360.com', 'admin123');

  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`✅ PASS: ${msg}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${msg}`);
    }
  }

  // 1. Unauthenticated
  console.log('--- 1. Unauthenticated Request ---');
  let res = await fetch(`${API_BASE}/dashboard/rankings`);
  assert(res.status === 401, 'GET /api/dashboard/rankings without auth returns 401');

  // 2. Employee Access & Privacy Check
  console.log('\n--- 2. Employee Role Access & Privacy Masking ---');
  res = await fetch(`${API_BASE}/dashboard/rankings`, {
    headers: { Authorization: `Bearer ${empLogin.token}` }
  });
  assert(res.status === 200, `Employee receives 200 OK for rankings (status: ${res.status})`);
  let json = await res.json();
  const empData = json.data;

  assert(Array.isArray(empData.topWorkingHours) && empData.topWorkingHours.length > 0, 'topWorkingHours returned as list');
  console.log('Top Working Hours #1:', empData.topWorkingHours[0]?.name, '-', empData.topWorkingHours[0]?.total_hours, 'hrs');

  assert(Array.isArray(empData.topAttendance) && empData.topAttendance.length > 0, 'topAttendance returned as list');
  console.log('Top Attendance #1:', empData.topAttendance[0]?.name, '-', empData.topAttendance[0]?.present_days, 'days present');

  assert(Array.isArray(empData.topPayroll) && empData.topPayroll.length > 0, 'topPayroll returned as list');
  const allMasked = empData.topPayroll.every(p => p.is_masked === true && p.total_compensation === 'Confidential');
  assert(allMasked, 'Employee role sees topPayroll with CONFIDENTIAL masked financial values (Zero financial leak)');

  // 3. HR Manager Access (Privileged)
  console.log('\n--- 3. HR Manager Role Access (Unmasked Compensation) ---');
  res = await fetch(`${API_BASE}/dashboard/rankings`, {
    headers: { Authorization: `Bearer ${hrLogin.token}` }
  });
  assert(res.status === 200, `HR Manager receives 200 OK (status: ${res.status})`);
  json = await res.json();
  const hrData = json.data;

  const hrUnmasked = hrData.topPayroll.every(p => p.is_masked === false && typeof p.total_compensation === 'number');
  assert(hrUnmasked, 'HR Manager sees exact unmasked compensation numbers');
  console.log('Top Compensation #1:', hrData.topPayroll[0]?.name, '- ₹', hrData.topPayroll[0]?.total_compensation);

  // 4. Department Filter
  console.log('\n--- 4. Department Filter Test (?department=Engineering) ---');
  res = await fetch(`${API_BASE}/dashboard/rankings?department=Engineering`, {
    headers: { Authorization: `Bearer ${adminLogin.token}` }
  });
  assert(res.status === 200, `Admin filtering by Engineering receives 200 OK`);
  json = await res.json();
  const engHours = json.data.topWorkingHours;
  const allEng = engHours.every(e => e.department === 'Engineering');
  assert(allEng, 'All returned employees belong to Engineering department when filtered');

  console.log(`\n====================================================`);
  console.log(`  RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log(`====================================================`);

  if (passed !== total) process.exit(1);
}

testRankingsSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
