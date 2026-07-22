const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
    // e.g. Plumbing, Electrical, Carpentry, Cleaning, Other
  },
  apartmentNumber: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  residentName: {
    type: String,
    required: true
  },
  technician: {
    type: String,
    default: 'Not Assigned'
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
