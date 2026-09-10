const Complaint = require('../models/Complaint');
const User      = require('../models/User');

/* ---- POST /api/complaints  (authenticated residents/admins) ---- */
async function addComplaint(req, res) {
  try {
    // Get resident identity from the verified JWT — NEVER trust the browser
    const user = await User.findById(req.user.id).select('name apartmentNumber');
    if (!user) {
      return res.status(404).json({ message: 'Authenticated user not found.' });
    }

    // Accept only safe complaint fields from the request body
    const { title, category, priority, description } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: 'Title, category, and description are required.' });
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      priority:        priority || 'Medium',
      residentName:    user.name,            // from DB, not from browser
      apartmentNumber: user.apartmentNumber, // from DB, not from browser
      residentId:      req.user.id,          // links complaint to authenticated user
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully', complaint });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/* ---- GET /api/complaints/stats  (public – homepage stats) ---- */
async function getStats(req, res) {
  try {
    const complaints = await Complaint.find().select('status');
    const total      = complaints.length;
    const pending    = complaints.filter(c => c.status === 'Pending').length;
    const assigned   = complaints.filter(c => c.status === 'Assigned').length;
    const inProgress = complaints.filter(c => c.status === 'In Progress').length;
    const completed  = complaints.filter(c => c.status === 'Completed').length;
    res.json({ total, pending, assigned, inProgress, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---- GET /api/complaints/my  (authenticated resident's own complaints) ---- */
async function getMyComplaints(req, res) {
  try {
    const complaints = await Complaint.find({ residentId: req.user.id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---- GET /api/complaints  (admin only – all complaints) ---- */
async function getAllComplaints(req, res) {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---- GET /api/complaints/:id  (authenticated – ownership enforced here) ---- */
async function getComplaint(req, res) {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Residents may only view their own complaints
    if (req.user.role !== 'admin') {
      if (!complaint.residentId || complaint.residentId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Access denied. This is not your complaint.' });
      }
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* ---- PUT /api/complaints/:id  (admin only) ---- */
async function updateComplaint(req, res) {
  try {
    // Whitelist only the fields admin is allowed to change — prevents mass-assignment
    const { technician, status, remarks } = req.body;
    const allowedUpdate = {};
    if (technician !== undefined) allowedUpdate.technician = technician;
    if (status     !== undefined) allowedUpdate.status     = status;
    if (remarks    !== undefined) allowedUpdate.remarks    = remarks;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      allowedUpdate,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint updated', complaint: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

/* ---- DELETE /api/complaints/:id  (admin only) ---- */
async function deleteComplaint(req, res) {
  try {
    const deleted = await Complaint.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  addComplaint,
  getStats,
  getMyComplaints,
  getAllComplaints,
  getComplaint,
  updateComplaint,
  deleteComplaint
};
