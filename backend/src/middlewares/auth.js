import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? 'peoplepay360_access_secret_2026';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'peoplepay360_refresh_secret_2026';
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '24h';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d';

// Generate short-lived Access Token (15 minutes)
export const generateAccessToken = (payload) => jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });

// Generate long-lived Refresh Token (7 days)
export const generateRefreshToken = (payload) => jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });

// Verify Refresh Token
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

// Strictly authenticate token middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Bearer access token missing.' 
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded; // { id, email, role, employee_id }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token expired (15m elapsed). Please invoke POST /api/auth/refresh-token.', 
        tokenExpired: true 
      });
    }
    return res.status(403).json({ success: false, message: 'Invalid access token.' });
  }
};

// Optional / Flexible authenticate middleware
export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET, { ignoreExpiration: true });
      req.user = decoded;
    } catch {
      // ignore
    }
  }
  next();
};

// Role-based authorization middleware enforcing Odoo specification hierarchy
export const authorize = (roles = []) => {
  const allowedRoles = (typeof roles === 'string' ? [roles] : roles).map(r => r.toLowerCase().trim());

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const rawRole = (req.user.role || '').toLowerCase().trim();
    // Normalize aliases to canonical 5 roles
    let role = rawRole;
    if (rawRole === 'hr') role = 'hr_manager';
    if (rawRole === 'payroll') role = 'hr_payroll_manager';

    // 1. Admin has full access to all modules and models across the platform
    if (role === 'admin') {
      return next();
    }

    // Check direct match or canonical aliases
    const hasDirectMatch = allowedRoles.some(allowed => {
      if (allowed === role) return true;
      if (allowed === 'hr' && role === 'hr_manager') return true;
      if (allowed === 'hr_manager' && role === 'hr') return true;
      if (allowed === 'payroll' && (role === 'hr_payroll_manager' || role === 'hr_payroll_user')) return true;
      if (allowed === 'hr_payroll_manager' && role === 'payroll') return true;
      return false;
    });

    if (hasDirectMatch) {
      return next();
    }

    // Role Hierarchy rules per Odoo spec:
    // HR Payroll Manager inherits all HR Payroll User permissions
    if (role === 'hr_payroll_manager' && allowedRoles.includes('hr_payroll_user')) {
      return next();
    }

    // HR Payroll User & HR Payroll Manager inherit all HR Manager permissions (Employees, Attendance, Contracts, Schedules, Time Off)
    if ((role === 'hr_payroll_user' || role === 'hr_payroll_manager') && 
        (allowedRoles.includes('hr_manager') || allowedRoles.includes('hr'))) {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]` 
    });
  };
};

export {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_EXPIRY,
  REFRESH_EXPIRY
};
