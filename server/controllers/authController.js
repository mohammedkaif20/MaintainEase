const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET  = process.env.JWT_SECRET  || 'maintainease_secret_key_change_in_prod';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/* Generate signed JWT */
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

/* ---- POST /api/auth/register ---- */
async function register(req, res) {
  try {
    const { name, email, password, apartmentNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Public registration ALWAYS creates a resident account.
    // The 'role' field from the frontend is intentionally ignored here.
    const role = 'resident';

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      apartmentNumber: apartmentNumber || '',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        role:            user.role,
        apartmentNumber: user.apartmentNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---- POST /api/auth/login ---- */
async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Role hint from frontend is used for login UX feedback only.
    // The actual role is always read from the database — never trusted from the client.
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `This account is registered as a ${user.role}, not ${role}.`,
      });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id:              user._id,
        name:            user.name,
        email:           user.email,
        role:            user.role,
        apartmentNumber: user.apartmentNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---- GET /api/auth/me  (protected by verifyToken middleware in route) ---- */
async function getMe(req, res) {
  try {
    // req.user is set by verifyToken middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login, getMe };
