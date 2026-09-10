const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/complaintController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Submit a new complaint — authenticated residents or admins
router.post('/', verifyToken, controller.addComplaint);

// Public stats for homepage — no token required
// IMPORTANT: /stats and /my must come BEFORE /:id to avoid being matched as an ID
router.get('/stats', controller.getStats);

// Get current user's own complaints — authenticated resident
router.get('/my', verifyToken, controller.getMyComplaints);

// Get all complaints — admin only
router.get('/', verifyToken, requireAdmin, controller.getAllComplaints);

// Get a single complaint by ID — authenticated (ownership enforced in controller)
router.get('/:id', verifyToken, controller.getComplaint);

// Update complaint (technician, status, remarks) — admin only
router.put('/:id', verifyToken, requireAdmin, controller.updateComplaint);

// Delete a complaint — admin only
router.delete('/:id', verifyToken, requireAdmin, controller.deleteComplaint);

module.exports = router;
