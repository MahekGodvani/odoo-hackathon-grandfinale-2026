const API_BASE = 'http://localhost:5000/api';

async function testTimeOffFlow() {
  console.log('====================================================');
  console.log('  TESTING TIME OFF REQUESTS & EMPLOYEE DROPDOWN DATA');
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

  // Login as HR Manager
  const hr = await login('amit.shah@peoplepay360.com', 'password123');
  // Login as Employee Priya Shah
  const emp = await login('priya.shah@peoplepay360.com', 'password123');

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

  // 1. HR Manager fetches employees
  console.log('--- 1. HR Manager fetching employees for dropdown ---');
  let res = await fetch(`${API_BASE}/employees`, {
    headers: { Authorization: `Bearer ${hr.token}` }
  });
  assert(res.status === 200, `HR Manager GET /employees returns 200 (status: ${res.status})`);
  let data = await res.json();
  const employees = data.employees || [];
  assert(Array.isArray(employees) && employees.length > 0, `Employees returned as non-empty list (count: ${employees.length})`);
  console.log(`Found ${employees.length} employees available for dropdown selection:`);
  employees.slice(0, 3).forEach(e => console.log(` - ${e.first_name} ${e.last_name} (${e.employee_code}, ID: ${e.id})`));

  // 2. Fetch Leave Types
  console.log('\n--- 2. Fetching Leave Types for dropdown ---');
  res = await fetch(`${API_BASE}/leave/types`, {
    headers: { Authorization: `Bearer ${hr.token}` }
  });
  assert(res.status === 200, `GET /leave/types returns 200 (status: ${res.status})`);
  data = await res.json();
  const leaveTypes = data.leaveTypes || [];
  assert(Array.isArray(leaveTypes) && leaveTypes.length > 0, `Leave types returned as non-empty list (count: ${leaveTypes.length})`);
  leaveTypes.forEach(t => console.log(` - ${t.name} (ID: ${t.id}, Unit: ${t.unit})`));

  // 3. Employee fetches own profile for time off
  console.log('\n--- 3. Employee fetching own record ---');
  res = await fetch(`${API_BASE}/employees`, {
    headers: { Authorization: `Bearer ${emp.token}` }
  });
  assert(res.status === 200, `Employee GET /employees returns 200`);
  data = await res.json();
  const empList = data.employees || [];
  assert(empList.length >= 1, `Employee has own profile populated (count: ${empList.length})`);
  console.log(` - Logged-in Employee: ${empList[0]?.first_name} ${empList[0]?.last_name} (ID: ${empList[0]?.id})`);

  // 4. Submit New Time Off Request
  console.log('\n--- 4. Submit New Time Off Request ---');
  res = await fetch(`${API_BASE}/leaves`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${emp.token}`
    },
    body: JSON.stringify({
      employee_id: empList[0]?.id,
      leave_type: 'vacation',
      start_date: '2026-09-10',
      end_date: '2026-09-12',
      total_days: 3,
      reason: 'Family vacation trip'
    })
  });
  assert(res.status === 201, `POST /leaves returns 201 Created (status: ${res.status})`);
  data = await res.json();
  assert(Boolean(data.leave_id), `Leave request created with ID: ${data.leave_id}`);

  // 5. Query Leaves List
  console.log('\n--- 5. Query Leaves List ---');
  res = await fetch(`${API_BASE}/leaves`, {
    headers: { Authorization: `Bearer ${hr.token}` }
  });
  assert(res.status === 200, `GET /leaves returns 200`);
  data = await res.json();
  assert(data.count > 0, `Leaves list contains created requests (count: ${data.count})`);

  console.log(`\n====================================================`);
  console.log(`  RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log(`====================================================`);

  if (passed !== total) process.exit(1);
}

testTimeOffFlow().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
