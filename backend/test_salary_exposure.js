const API_BASE = 'http://localhost:5000/api';

async function testSalaryExposure() {
  console.log('====================================================');
  console.log('  TESTING SALARIES & CONTRACTS ACCESS CONTROL SUITE');
  console.log('====================================================\n');

  // Authenticate Employee and Privileged roles
  async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return { token: data.token || data.access_token || data.tokens?.accessToken, user: data.user };
  }

  const empLogin = await login('priya.shah@peoplepay360.com', 'password123');
  const hrLogin = await login('amit.shah@peoplepay360.com', 'password123');
  const payrollUserLogin = await login('neha.patel@peoplepay360.com', 'password123');
  const payrollMgrLogin = await login('rahul.patel@peoplepay360.com', 'password123');
  const adminLogin = await login('admin@peoplepay360.com', 'admin123');

  const empToken = empLogin.token;
  const empId = empLogin.user.employee_id; // Priya Shah's employee ID
  const otherEmpId = 1; // Different employee ID (e.g. Alex Johnson or Jaimil)

  console.log(`Priya Shah (Employee role): empId = ${empId}`);
  console.log(`Target other employee: otherEmpId = ${otherEmpId}\n`);

  async function req(method, path, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}${path}`, { method, headers });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  }

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
    }
  }

  // 1. Unauthenticated checks
  console.log('--- 1. Unauthenticated Requests ---');
  let res = await req('GET', '/salaries', null);
  assert(res.status === 401, 'GET /api/salaries without token returns 401');

  res = await req('GET', `/salaries/${empId}`, null);
  assert(res.status === 401, 'GET /api/salaries/:id without token returns 401');

  // 2. Employee attempting to access all salaries
  console.log('\n--- 2. Employee Accessing All Salaries Directory ---');
  res = await req('GET', '/salaries', empToken);
  assert(res.status === 403, `GET /api/salaries with employee role returns 403 Forbidden (got ${res.status}: "${res.data.message}")`);

  // 3. Employee accessing specific employee salary
  console.log('\n--- 3. Employee Accessing Specific Salary Records ---');
  // Attempt to access someone else's salary
  res = await req('GET', `/salaries/${otherEmpId}`, empToken);
  assert(res.status === 403, `Employee querying OTHER employee's salary (/salaries/${otherEmpId}) returns 403 Forbidden (got ${res.status}: "${res.data.message}")`);

  // Attempt to access own salary
  res = await req('GET', `/salaries/${empId}`, empToken);
  assert(res.status === 200 || res.status === 404, `Employee querying OWN salary (/salaries/${empId}) allowed past authorization (status ${res.status})`);

  // 4. Privileged roles accessing salaries
  console.log('\n--- 4. Privileged Roles Accessing All Salaries ---');
  res = await req('GET', '/salaries', hrLogin.token);
  assert(res.status === 200, `HR Manager can view /api/salaries (got ${res.status})`);

  res = await req('GET', '/salaries', payrollUserLogin.token);
  assert(res.status === 200, `HR Payroll User can view /api/salaries (got ${res.status})`);

  res = await req('GET', '/salaries', payrollMgrLogin.token);
  assert(res.status === 200, `HR Payroll Manager can view /api/salaries (got ${res.status})`);

  res = await req('GET', '/salaries', adminLogin.token);
  assert(res.status === 200, `Admin can view /api/salaries (got ${res.status})`);

  // 5. Contracts endpoint protection
  console.log('\n--- 5. Contracts Endpoint Protection ---');
  res = await req('GET', '/contracts', empToken);
  assert(res.status === 403, `Employee querying /api/contracts returns 403 Forbidden (got ${res.status})`);

  res = await req('GET', `/contracts/employee/${otherEmpId}`, empToken);
  assert(res.status === 403, `Employee querying /api/contracts/employee/${otherEmpId} returns 403 Forbidden (got ${res.status})`);

  console.log(`\n====================================================`);
  console.log(`  RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log(`====================================================`);

  if (passed !== total) {
    process.exit(1);
  }
}

testSalaryExposure().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
