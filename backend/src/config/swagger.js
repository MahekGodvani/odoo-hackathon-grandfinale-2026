const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'PeoplePay360 API Documentation',
    version: '1.0.0',
    description: 'Interactive API Documentation for the PeoplePay360 HR & Payroll Platform.',
    contact: {
      name: 'PeoplePay360 Support',
      email: 'support@peoplepay360.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
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
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error description message' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@peoplepay360.com' },
          password: { type: 'string', example: 'admin123' }
        }
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1Ni...' }
        }
      },
      EmployeeCreateRequest: {
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
          bank_account_no: { type: 'string', example: '9876543210' },
          bank_ifsc_code: { type: 'string', example: 'CHASUS33' },
          role: { type: 'string', enum: ['employee', 'hr', 'payroll', 'admin'], example: 'employee' },
          password: { type: 'string', example: 'password123' }
        }
      },
      ContractAssignRequest: {
        type: 'object',
        required: ['employee_id', 'start_date'],
        properties: {
          employee_id: { type: 'integer', example: 1 },
          contract_type: { type: 'string', enum: ['full_time', 'part_time', 'contract'], example: 'full_time' },
          base_salary: { type: 'number', example: 5000.00 },
          hra_allowance: { type: 'number', example: 1000.00 },
          transport_allowance: { type: 'number', example: 300.00 },
          other_allowance: { type: 'number', example: 200.00 },
          tax_deduction_rate: { type: 'number', example: 10.00 },
          start_date: { type: 'string', format: 'date', example: '2026-01-15' },
          end_date: { type: 'string', format: 'date', example: '2027-01-15' }
        }
      },
      AttendanceLogRequest: {
        type: 'object',
        required: ['employee_id', 'date'],
        properties: {
          employee_id: { type: 'integer', example: 1 },
          date: { type: 'string', format: 'date', example: '2026-09-01' },
          check_in: { type: 'string', example: '09:00:00' },
          check_out: { type: 'string', example: '18:00:00' },
          status: { type: 'string', enum: ['present', 'absent', 'half_day', 'on_leave'], example: 'present' }
        }
      },
      LeaveApplyRequest: {
        type: 'object',
        required: ['start_date', 'end_date'],
        properties: {
          employee_id: { type: 'integer', example: 1 },
          leave_type: { type: 'string', enum: ['casual', 'sick', 'paid', 'unpaid'], example: 'casual' },
          start_date: { type: 'string', format: 'date', example: '2026-09-10' },
          end_date: { type: 'string', format: 'date', example: '2026-09-11' },
          total_days: { type: 'integer', example: 2 },
          reason: { type: 'string', example: 'Family function' }
        }
      },
      PayrollGenerateRequest: {
        type: 'object',
        required: ['period_month', 'period_year'],
        properties: {
          period_month: { type: 'integer', minimum: 1, maximum: 12, example: 9 },
          period_year: { type: 'integer', example: 2026 }
        }
      }
    }
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login with email and password',
        description: 'Authenticates user and returns 15-minute accessToken + 7-day refreshToken.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/api/auth/refresh-token': {
      post: {
        tags: ['Authentication'],
        summary: 'Renew Access Token',
        description: 'Invoked when 15-minute access token expires. Issues new 15-minute access token and rotated refresh token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RefreshTokenRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Token refreshed successfully' },
          403: { description: 'Invalid or expired refresh token' }
        }
      }
    },
    '/api/auth/logout': {
      post: {
        tags: ['Authentication'],
        summary: 'Logout user',
        description: 'Clears and revokes refresh token in database.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  refreshToken: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Logged out successfully' }
        }
      }
    },
    '/api/auth/forgot-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Request password reset token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: { type: 'string', example: 'alex.johnson@peoplepay360.com' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Reset token generated' }
        }
      }
    },
    '/api/auth/reset-password': {
      post: {
        tags: ['Authentication'],
        summary: 'Reset password using token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token', 'newPassword'],
                properties: {
                  token: { type: 'string', example: 'your_reset_token_here' },
                  newPassword: { type: 'string', example: 'newPassword123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Password reset successfully' },
          400: { description: 'Invalid or expired token' }
        }
      }
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile details' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/auth/profile': {
      put: {
        tags: ['Authentication'],
        summary: 'Edit profile and change password',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  first_name: { type: 'string', example: 'Alexander' },
                  last_name: { type: 'string', example: 'Johnson' },
                  phone: { type: 'string', example: '+1234567890' },
                  bank_name: { type: 'string', example: 'Chase Bank' },
                  bank_account_no: { type: 'string', example: '9876543210' },
                  bank_ifsc_code: { type: 'string', example: 'CHASUS33' },
                  currentPassword: { type: 'string', example: 'admin123' },
                  newPassword: { type: 'string', example: 'newSecret123' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Profile updated successfully' }
        }
      }
    },
    '/api/employees': {
      get: {
        tags: ['Employees'],
        summary: 'List all employees',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'department', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'probation', 'inactive'] } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'List of employees with active contracts' }
        }
      },
      post: {
        tags: ['Employees'],
        summary: 'Create employee & user profile (Admin / HR)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EmployeeCreateRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Employee created successfully' },
          400: { description: 'Missing required fields' }
        }
      }
    },
    '/api/employees/{id}': {
      get: {
        tags: ['Employees'],
        summary: 'Get employee by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Employee details' },
          404: { description: 'Employee not found' }
        }
      },
      put: {
        tags: ['Employees'],
        summary: 'Update employee (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  first_name: { type: 'string' },
                  last_name: { type: 'string' },
                  phone: { type: 'string' },
                  department: { type: 'string' },
                  designation: { type: 'string' },
                  status: { type: 'string', enum: ['active', 'probation', 'inactive'] },
                  bank_name: { type: 'string' },
                  bank_account_no: { type: 'string' },
                  bank_ifsc_code: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Employee updated successfully' }
        }
      }
    },
    '/api/contracts/employee/{employeeId}': {
      get: {
        tags: ['Contracts'],
        summary: 'Get contract history for employee',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'employeeId', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Contract details' }
        }
      }
    },
    '/api/contracts/assign': {
      post: {
        tags: ['Contracts'],
        summary: 'Assign / Renew Salary Contract (Admin / HR)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContractAssignRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Contract assigned' }
        }
      }
    },
    '/api/attendance/log': {
      post: {
        tags: ['Attendance'],
        summary: 'Log daily attendance / clock in-out',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AttendanceLogRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Attendance recorded' }
        }
      }
    },
    '/api/attendance': {
      get: {
        tags: ['Attendance'],
        summary: 'View attendance records',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'employee_id', in: 'query', schema: { type: 'integer' } },
          { name: 'date', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'month', in: 'query', schema: { type: 'integer' } },
          { name: 'year', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Attendance logs' }
        }
      }
    },
    '/api/leaves': {
      get: {
        tags: ['Leave Requests'],
        summary: 'List leave applications',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'employee_id', in: 'query', schema: { type: 'integer' } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'] } }
        ],
        responses: {
          200: { description: 'Leave requests list' }
        }
      }
    },
    '/api/leaves/apply': {
      post: {
        tags: ['Leave Requests'],
        summary: 'Apply for leave',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LeaveApplyRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Leave request submitted' }
        }
      }
    },
    '/api/leaves/{id}/status': {
      put: {
        tags: ['Leave Requests'],
        summary: 'Approve or Reject Leave (Admin / HR)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['approved', 'rejected', 'pending'] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Leave status updated' }
        }
      }
    },
    '/api/payroll': {
      get: {
        tags: ['Payroll Engine'],
        summary: 'List all payroll cycles (Admin / HR / Payroll)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'List of payroll runs' }
        }
      }
    },
    '/api/payroll/generate': {
      post: {
        tags: ['Payroll Engine'],
        summary: 'Auto-calculate monthly salaries & generate payslips',
        description: 'Aggregates contract terms, attendance days, and unpaid leave deductions to generate itemized payslips.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PayrollGenerateRequest' }
            }
          }
        },
        responses: {
          201: { description: 'Payroll cycle calculated & payslips generated' }
        }
      }
    },
    '/api/payroll/{id}/approve': {
      put: {
        tags: ['Payroll Engine'],
        summary: 'Approve payroll cycle (Admin / Payroll)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Payroll approved' }
        }
      }
    },
    '/api/payroll/{id}/pay': {
      put: {
        tags: ['Payroll Engine'],
        summary: 'Mark payroll as Paid and disburse payslips',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Payroll paid & payslips sent' }
        }
      }
    },
    '/api/payslips': {
      get: {
        tags: ['Payslips'],
        summary: 'List payslips (Employees see only their own)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'payroll_id', in: 'query', schema: { type: 'integer' } },
          { name: 'employee_id', in: 'query', schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'List of itemized payslips' }
        }
      }
    },
    '/api/payslips/{id}': {
      get: {
        tags: ['Payslips'],
        summary: 'Get itemized payslip breakdown by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: {
          200: { description: 'Payslip details' },
          404: { description: 'Payslip not found' }
        }
      }
    },
    '/api/dashboard/stats': {
      get: {
        tags: ['Dashboard Analytics'],
        summary: 'Get company metrics and overview stats',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Analytics data' }
        }
      }
    }
  }
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'PeoplePay360 API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true
    }
  }));

  // Direct JSON endpoint
  app.get('/api-docs.json', (req, res) => res.json(swaggerDocument));
};

module.exports = { setupSwagger, swaggerDocument };
