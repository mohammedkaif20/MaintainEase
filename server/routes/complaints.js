const express = require('express');
const router = express.Router();
const controller = require('../controllers/complaintController');

// Add a new complaint
router.post('/', controller.addComplaint);

// Get all complaints
router.get('/', controller.getAllComplaints);

// Get a single complaint by ID
router.get('/:id', controller.getComplaint);

// Update complaint (technician, status, remarks)
router.put('/:id', controller.updateComplaint);

// Delete a complaint
router.delete('/:id', controller.deleteComplaint);

module.exports = router;
