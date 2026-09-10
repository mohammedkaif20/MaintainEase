/* ======================================================
   middleware/auth.js
   Reusable authentication & authorization middleware
   ====================================================== */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'maintainease_secret_key_change_in_prod';

/* ---- Verify Bearer token ---- */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
}

/* ---- Require admin role (must run after verifyToken) ---- */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin };
