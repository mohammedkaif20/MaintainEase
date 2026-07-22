const Complaint = require('../models/Complaint');

// Add a new complaint
async function addComplaint(req, res) {
  try {
    const complaint = new Complaint(req.body);
    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Get all complaints (newest first)
async function getAllComplaints(req, res) {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Get one complaint by ID
async function getComplaint(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update complaint (assign technician, change status, add remarks)
async function updateComplaint(req, res) {
  try {
    const updated = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint updated', complaint: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

// Delete a complaint
async function deleteComplaint(req, res) {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { addComplaint, getAllComplaints, getComplaint, updateComplaint, deleteComplaint };
