const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', controller.register);

// POST /api/auth/login
router.post('/login', controller.login);

// GET  /api/auth/me  – verify token & get current user
router.get('/me', controller.getMe);

module.exports = router;
