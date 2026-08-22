const jwt = require('jsonwebtoken');

// Verify incoming Bearer token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dayflow_secret_key');
    req.user = decoded; // { id, role, employee_id, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Check if user has required role (e.g., ADMIN vs EMPLOYEE)
const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges.' });
    }
    const userRole = req.user.role.toUpperCase();
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges.' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };