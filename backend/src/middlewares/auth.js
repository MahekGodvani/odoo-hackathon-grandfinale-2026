import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? process.env.JWT_SECRET ?? 'peoplepay360_access_secret_2026';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'peoplepay360_refresh_secret_2026';
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m';
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

// Role-based authorization middleware
export const authorize = (roles = []) => {
  const allowedRoles = typeof roles === 'string' ? [roles] : roles;

  return (req, res, next) => {
    if (!req.user || (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role))) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: requires one of the following roles: [${allowedRoles.join(', ')}]` 
      });
    }
    next();
  };
};

export {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_EXPIRY,
  REFRESH_EXPIRY
};
