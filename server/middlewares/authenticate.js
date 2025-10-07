const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

/**
 * 🔒 Authentication Middleware
 * Verifies JWT token from cookies or Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided.' });

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      _id: payload.id,
      role: payload.role,
      username: payload.username || null,
      email: payload.email || null,
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(403).json({ message: 'Access Denied: Invalid or expired token.' });
  }
};

/**
 * 🔑 Role-Based Authorization Middleware
 * Usage: restrictTo('client', 'freelancer', 'admin')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// ✅ Export both as named properties for proper destructuring
module.exports = { authenticate, restrictTo };
