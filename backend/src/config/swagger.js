const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'PeoplePay360 REST API',
    version: '1.0.0',
    description: 'Complete, production-ready API for the PeoplePay360 HR, Attendance & Payroll Management System.',
    contact: {
      name: 'PeoplePay360 API Team',
      email: 'support@peoplepay360.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Express Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your 15-minute JWT Access Token'
      }
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication, registration, JWT lifecycle & profile management' },
    { name: 'Companies', description: 'Company profiles & multi-tenant settings' },
    { name: 'Employees', description: 'Employee master record management' },
    { name: 'Attendance', description: 'Real-time check-in, check-out & monthly timesheets' },
    { name: 'Salaries', description: 'Base salary, allowances & compensation structures' },
    { name: 'Payroll', description: 'Automated salary calculation & payroll approval lifecycle' },
    { name: 'Payslips', description: 'Itemized payslip generation, exports & delivery' },
    { name: 'Leaves', description: 'Leave application & HR approvals' },
    { name: 'Bank & Payments', description: 'Employee bank accounts & payment disbursement' },
    { name: 'Dashboard', description: 'Role-based dashboard analytics & KPI summaries' },
    { name: 'Notifications', description: 'System alerts & announcements' },
    { name: 'Settings', description: 'Application configuration & company settings' },
    { name: 'Reports', description: 'Analytics, tax withholding, & CSV/Excel export' },
    { name: 'Roles & Permissions', description: 'Role-based access control (RBAC)' }
  ],
  paths: {
    // -------------------------------------------------------------
    // AUTH
    // -------------------------------------------------------------
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'newuser@peoplepay360.com' },
                  password: { type: 'string', example: 'securePass123' },
                  role: { type: 'string', enum: ['employee', 'hr', 'payroll', 'admin'], example: 'employee' },
                  first_name: { type: 'string', example: 'Jane' },
                  last_name: { type: 'string', example: 'Doe' },
                  department: { type: 'string', example: 'Engineering' },
                  designation: { type: 'string', example: 'Frontend Developer' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'User registered' } }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@peoplepay360.com' },
                  password: { type: 'string', example: 'admin123' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Login successful' } }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout and revoke refresh token',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { refreshToken: { type: 'string' } }
              }
            }
          }
        },
        responses: { 200: { description: 'Logged out' } }
      }
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Renew 15-minute Access Token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: { refreshToken: { type: 'string' } }
              }
            }
          }
        },
        responses: { 200: { description: 'Token renewed' } }
      }
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: { email: { type: 'string', example: 'alex.johnson@peoplepay360.com' } }
              }
            }
          }
        },
        responses: { 200: { description: 'Token generated' } }
      }
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password using token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string' },
                  newPassword: { type: 'string', example: 'brandNewPassword123' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Password reset' } }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Profile details' } }
      }
    },

    // -------------------------------------------------------------
    // COMPANIES
    // -------------------------------------------------------------
    '/api/companies': {
      get: {
        tags: ['Companies'],
        summary: 'List companies',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Companies list' } }
      },
      post: {
        tags: ['Companies'],
        summary: 'Create company (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Acme Corp' },
                  email: { type: 'string', example: 'hr@acme.com' },
                  phone: { type: 'string', example: '+15550192834' },
                  currency: { type: 'string', example: 'USD' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Company created' } }
      }
    },
    '/api/companies/{id}': {
      get: {
        tags: ['Companies'],
        summary: 'Get company by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Company details' } }
      },
      put: {
        tags: ['Companies'],
        summary: 'Update company (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Company updated' } }
      },
      delete: {
        tags: ['Companies'],
        summary: 'Delete company (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Company deleted' } }
      }
    },

    // -------------------------------------------------------------
    // EMPLOYEES
    // -------------------------------------------------------------
    '/api/employees': {
      get: {
        tags: ['Employees'],
        summary: 'List all employees',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'department', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Employees list' } }
      },
      post: {
        tags: ['Employees'],
        summary: 'Create employee (Admin / HR)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['employee_code', 'first_name', 'last_name', 'email', 'department', 'designation', 'joining_date'],
                properties: {
                  employee_code: { type: 'string', example: 'EMP-1003' },
                  first_name: { type: 'string', example: 'John' },
                  last_name: { type: 'string', example: 'Doe' },
                  email: { type: 'string', example: 'john.doe@peoplepay360.com' },
                  phone: { type: 'string', example: '+1234567890' },
                  department: { type: 'string', example: 'Engineering' },
                  designation: { type: 'string', example: 'Software Engineer' },
                  joining_date: { type: 'string', format: 'date', example: '2026-01-15' },
                  bank_name: { type: 'string', example: 'Chase Bank' },
                  bank_account_no: { type: 'string', example: '9876543210' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Employee created' } }
      }
    },
    '/api/employees/{id}': {
      get: {
        tags: ['Employees'],
        summary: 'Get employee by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee details' } }
      },
      put: {
        tags: ['Employees'],
        summary: 'Update employee (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee updated' } }
      },
      delete: {
        tags: ['Employees'],
        summary: 'Delete employee (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee deleted' } }
      }
    },

    // -------------------------------------------------------------
    // ATTENDANCE
    // -------------------------------------------------------------
    '/api/attendance/check-in': {
      post: {
        tags: ['Attendance'],
        summary: 'Check-in (Clock In)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { employee_id: { type: 'integer', example: 1 } }
              }
            }
          }
        },
        responses: { 200: { description: 'Check-in successful' } }
      }
    },
    '/api/attendance/check-out': {
      post: {
        tags: ['Attendance'],
        summary: 'Check-out (Clock Out)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { employee_id: { type: 'integer', example: 1 } }
              }
            }
          }
        },
        responses: { 200: { description: 'Check-out successful' } }
      }
    },
    '/api/attendance': {
      get: {
        tags: ['Attendance'],
        summary: 'List attendance records',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'employee_id', in: 'query', schema: { type: 'integer' } },
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'month', in: 'query', schema: { type: 'integer' } },
          { name: 'year', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Attendance logs' } }
      }
    },
    '/api/attendance/{employeeId}': {
      get: {
        tags: ['Attendance'],
        summary: 'Get attendance for specific employee',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee attendance logs' } }
      }
    },
    '/api/attendance/{employeeId}/monthly': {
      get: {
        tags: ['Attendance'],
        summary: 'Get monthly attendance summary for employee',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } },
          { name: 'month', in: 'query', schema: { type: 'integer' } },
          { name: 'year', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Monthly summary' } }
      }
    },
    '/api/attendance/{id}': {
      put: {
        tags: ['Attendance'],
        summary: 'Update attendance record (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Attendance updated' } }
      },
      delete: {
        tags: ['Attendance'],
        summary: 'Delete attendance record (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Attendance deleted' } }
      }
    },

    // -------------------------------------------------------------
    // SALARIES
    // -------------------------------------------------------------
    '/api/salaries': {
      get: {
        tags: ['Salaries'],
        summary: 'List all salary structures',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Salary list' } }
      },
      post: {
        tags: ['Salaries'],
        summary: 'Assign / Create salary structure (Admin / HR / Payroll)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['employee_id', 'start_date'],
                properties: {
                  employee_id: { type: 'integer', example: 1 },
                  contract_type: { type: 'string', enum: ['full_time', 'part_time', 'contract'], example: 'full_time' },
                  base_salary: { type: 'number', example: 5000 },
                  hra_allowance: { type: 'number', example: 1000 },
                  transport_allowance: { type: 'number', example: 300 },
                  other_allowance: { type: 'number', example: 200 },
                  tax_deduction_rate: { type: 'number', example: 10 },
                  start_date: { type: 'string', format: 'date', example: '2026-01-15' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Salary created' } }
      }
    },
    '/api/salaries/{employeeId}': {
      get: {
        tags: ['Salaries'],
        summary: 'Get salary structure by Employee ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee salary structure' } }
      }
    },
    '/api/salaries/{id}': {
      put: {
        tags: ['Salaries'],
        summary: 'Update salary structure',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Salary updated' } }
      },
      delete: {
        tags: ['Salaries'],
        summary: 'Delete salary structure',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Salary deleted' } }
      }
    },

    // -------------------------------------------------------------
    // PAYROLL
    // -------------------------------------------------------------
    '/api/payroll': {
      get: {
        tags: ['Payroll'],
        summary: 'List payroll cycles (Admin / HR / Payroll)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Payrolls list' } }
      }
    },
    '/api/payroll/generate': {
      post: {
        tags: ['Payroll'],
        summary: 'Auto-calculate monthly salaries & generate payslips',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['period_month', 'period_year'],
                properties: {
                  period_month: { type: 'integer', example: 9 },
                  period_year: { type: 'integer', example: 2026 }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Payroll cycle generated' } }
      }
    },
    '/api/payroll/{id}': {
      get: {
        tags: ['Payroll'],
        summary: 'Get payroll cycle details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payroll run details' } }
      }
    },
    '/api/payroll/employee/{employeeId}': {
      get: {
        tags: ['Payroll'],
        summary: 'Get payroll history for specific employee',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee payroll history' } }
      }
    },
    '/api/payroll/{id}/process': {
      post: {
        tags: ['Payroll'],
        summary: 'Mark payroll as processing',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payroll processing' } }
      }
    },
    '/api/payroll/{id}/approve': {
      post: {
        tags: ['Payroll'],
        summary: 'Approve payroll cycle',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payroll approved' } }
      }
    },
    '/api/payroll/{id}/pay': {
      put: {
        tags: ['Payroll'],
        summary: 'Mark salaries as Paid and disburse payslips',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payroll paid' } }
      }
    },

    // -------------------------------------------------------------
    // PAYSLIPS
    // -------------------------------------------------------------
    '/api/payslips': {
      get: {
        tags: ['Payslips'],
        summary: 'List payslips',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'payroll_id', in: 'query', schema: { type: 'integer' } },
          { name: 'employee_id', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Payslips list' } }
      }
    },
    '/api/payslips/{id}': {
      get: {
        tags: ['Payslips'],
        summary: 'Get itemized payslip breakdown',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payslip details' } }
      }
    },
    '/api/payslips/employee/{employeeId}': {
      get: {
        tags: ['Payslips'],
        summary: 'Get payslips for employee',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Employee payslips' } }
      }
    },
    '/api/payslips/{id}/download': {
      get: {
        tags: ['Payslips'],
        summary: 'Download payslip summary document',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payslip summary download' } }
      }
    },
    '/api/payslips/{id}/send': {
      post: {
        tags: ['Payslips'],
        summary: 'Send payslip email to employee',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payslip sent' } }
      }
    },

    // -------------------------------------------------------------
    // LEAVES
    // -------------------------------------------------------------
    '/api/leaves': {
      get: {
        tags: ['Leaves'],
        summary: 'List leave requests',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'employee_id', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } }
        ],
        responses: { 200: { description: 'Leaves list' } }
      },
      post: {
        tags: ['Leaves'],
        summary: 'Apply for leave',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['start_date', 'end_date'],
                properties: {
                  employee_id: { type: 'integer', example: 1 },
                  leave_type: { type: 'string', enum: ['casual', 'sick', 'paid', 'unpaid', 'maternity', 'emergency'], example: 'casual' },
                  start_date: { type: 'string', format: 'date', example: '2026-09-10' },
                  end_date: { type: 'string', format: 'date', example: '2026-09-11' },
                  total_days: { type: 'integer', example: 2 },
                  reason: { type: 'string', example: 'Family function' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Leave submitted' } }
      }
    },
    '/api/leaves/{id}': {
      get: {
        tags: ['Leaves'],
        summary: 'Get leave request by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Leave details' } }
      },
      put: {
        tags: ['Leaves'],
        summary: 'Update pending leave request',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Leave updated' } }
      },
      delete: {
        tags: ['Leaves'],
        summary: 'Cancel / Delete leave request',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Leave deleted' } }
      }
    },
    '/api/leaves/{id}/approve': {
      post: {
        tags: ['Leaves'],
        summary: 'Approve leave request (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Leave approved' } }
      }
    },
    '/api/leaves/{id}/reject': {
      post: {
        tags: ['Leaves'],
        summary: 'Reject leave request (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Leave rejected' } }
      }
    },

    // -------------------------------------------------------------
    // BANK & PAYMENTS
    // -------------------------------------------------------------
    '/api/bank-accounts': {
      post: {
        tags: ['Bank & Payments'],
        summary: 'Add bank account for employee',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['employee_id', 'bank_name', 'account_number'],
                properties: {
                  employee_id: { type: 'integer', example: 1 },
                  bank_name: { type: 'string', example: 'Chase Bank' },
                  account_number: { type: 'string', example: '9876543210' },
                  ifsc_code: { type: 'string', example: 'CHASUS33' },
                  account_type: { type: 'string', enum: ['savings', 'checking', 'salary'], example: 'salary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Bank account added' } }
      }
    },
    '/api/bank-accounts/{employeeId}': {
      get: {
        tags: ['Bank & Payments'],
        summary: 'Get bank accounts for employee',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Bank accounts' } }
      }
    },
    '/api/bank-accounts/{id}': {
      put: {
        tags: ['Bank & Payments'],
        summary: 'Update bank account details',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Bank account updated' } }
      }
    },
    '/api/payments': {
      get: {
        tags: ['Bank & Payments'],
        summary: 'List payment transactions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Payments list' } }
      },
      post: {
        tags: ['Bank & Payments'],
        summary: 'Record salary disbursement payment (Admin / Payroll)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['employee_id', 'amount'],
                properties: {
                  payroll_id: { type: 'integer', example: 1 },
                  employee_id: { type: 'integer', example: 1 },
                  amount: { type: 'number', example: 5850.00 },
                  payment_method: { type: 'string', enum: ['bank_transfer', 'cheque', 'cash', 'upi'], example: 'bank_transfer' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Payment recorded' } }
      }
    },
    '/api/payments/{id}': {
      get: {
        tags: ['Bank & Payments'],
        summary: 'Get payment record by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payment details' } }
      }
    },

    // -------------------------------------------------------------
    // DASHBOARD
    // -------------------------------------------------------------
    '/api/dashboard/admin': {
      get: {
        tags: ['Dashboard'],
        summary: 'Admin Dashboard Overview',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Admin metrics' } }
      }
    },
    '/api/dashboard/hr': {
      get: {
        tags: ['Dashboard'],
        summary: 'HR Dashboard Metrics & Leave Queue',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'HR metrics' } }
      }
    },
    '/api/dashboard/employee': {
      get: {
        tags: ['Dashboard'],
        summary: 'Employee Self-Service Dashboard',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Employee dashboard details' } }
      }
    },
    '/api/dashboard/payroll-summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Monthly Payroll Financial Summary',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Financial summary' } }
      }
    },
    '/api/dashboard/attendance-summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Today Attendance Status Summary',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Attendance summary' } }
      }
    },

    // -------------------------------------------------------------
    // NOTIFICATIONS
    // -------------------------------------------------------------
    '/api/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Notifications list' } }
      }
    },
    '/api/notifications/{id}/read': {
      put: {
        tags: ['Notifications'],
        summary: 'Mark notification as read',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Notification marked read' } }
      }
    },
    '/api/notifications/send': {
      post: {
        tags: ['Notifications'],
        summary: 'Send notification to user (Admin / HR)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['user_id', 'title', 'message'],
                properties: {
                  user_id: { type: 'integer', example: 4 },
                  title: { type: 'string', example: 'Payslip Ready' },
                  message: { type: 'string', example: 'Your payslip for this month is ready.' },
                  type: { type: 'string', enum: ['info', 'warning', 'success', 'payroll', 'leave'], example: 'payroll' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Notification sent' } }
      }
    },

    // -------------------------------------------------------------
    // SETTINGS
    // -------------------------------------------------------------
    '/api/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get app configuration settings',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Settings key-values' } }
      },
      put: {
        tags: ['Settings'],
        summary: 'Update app settings (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                example: { working_days_per_month: "30", default_currency: "USD" }
              }
            }
          }
        },
        responses: { 200: { description: 'Settings updated' } }
      }
    },
    '/api/company/settings': {
      get: {
        tags: ['Settings'],
        summary: 'Get company settings',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Company settings' } }
      },
      put: {
        tags: ['Settings'],
        summary: 'Update company settings (Admin)',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Company settings updated' } }
      }
    },

    // -------------------------------------------------------------
    // REPORTS
    // -------------------------------------------------------------
    '/api/reports/payroll': {
      get: {
        tags: ['Reports'],
        summary: 'Annual Payroll Summary Report',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'year', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Payroll report' } }
      }
    },
    '/api/reports/attendance': {
      get: {
        tags: ['Reports'],
        summary: 'Employee Attendance Summary Report',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'month', in: 'query', schema: { type: 'integer' } },
          { name: 'year', in: 'query', schema: { type: 'integer' } }
        ],
        responses: { 200: { description: 'Attendance report' } }
      }
    },
    '/api/reports/leave': {
      get: {
        tags: ['Reports'],
        summary: 'Leave Utilization Report',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'year', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Leave report' } }
      }
    },
    '/api/reports/salary': {
      get: {
        tags: ['Reports'],
        summary: 'Department Salary Distribution Report',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Salary report' } }
      }
    },
    '/api/reports/tax': {
      get: {
        tags: ['Reports'],
        summary: 'Tax Withholding Report',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'year', in: 'query', schema: { type: 'integer' } }],
        responses: { 200: { description: 'Tax report' } }
      }
    },
    '/api/reports/export': {
      get: {
        tags: ['Reports'],
        summary: 'Export Dataset Summary',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'type', in: 'query', schema: { type: 'string', enum: ['payroll', 'employees'] } }],
        responses: { 200: { description: 'Exported dataset' } }
      }
    },

    // -------------------------------------------------------------
    // ROLES & PERMISSIONS
    // -------------------------------------------------------------
    '/api/roles': {
      get: {
        tags: ['Roles & Permissions'],
        summary: 'List roles',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Roles list' } }
      },
      post: {
        tags: ['Roles & Permissions'],
        summary: 'Create custom role (Admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'auditor' },
                  description: { type: 'string', example: 'Auditor access' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Role created' } }
      }
    },
    '/api/roles/{id}': {
      put: {
        tags: ['Roles & Permissions'],
        summary: 'Update role (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Role updated' } }
      },
      delete: {
        tags: ['Roles & Permissions'],
        summary: 'Delete role (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Role deleted' } }
      }
    },
    '/api/permissions': {
      get: {
        tags: ['Roles & Permissions'],
        summary: 'List permissions',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Permissions list' } }
      }
    },
    '/api/users/{id}/role': {
      put: {
        tags: ['Roles & Permissions'],
        summary: 'Assign role to user (Admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['admin', 'hr', 'payroll', 'employee'], example: 'hr' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'User role updated' } }
      }
    }
  }
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'PeoplePay360 Complete API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true
    }
  }));

  app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));
};

module.exports = { setupSwagger, swaggerDocument };
