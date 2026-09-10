const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', controller.register);

// POST /api/auth/login
router.post('/login', controller.login);

// GET  /api/auth/me  – requires valid JWT
router.get('/me', verifyToken, controller.getMe);

module.exports = router;
