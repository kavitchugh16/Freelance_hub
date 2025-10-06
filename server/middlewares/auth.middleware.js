const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

/**
 * ✅ Verify JWT and attach user to req.user
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token either from cookies or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch full user data (optional but helpful for role-based checks)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

/**
 * ✅ Restrict route access based on user role (client or freelancer)
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
