// server/src/middlewares/authenticate.js
const jwt = require('jsonwebtoken');

// Use environment variable or default secret
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

/**
 * 🔒 Authentication Middleware
 * Verifies JWT token from cookies or Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    // Token can come from cookies or "Authorization: Bearer <token>" header
    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided.' });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach user info to request object
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
 * Usage: restrictTo('client', 'admin')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// Export both middlewares
module.exports = { authenticate, restrictTo };
