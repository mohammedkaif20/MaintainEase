const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const complaintRoutes = require('./routes/complaints');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files from the client folder
app.use(express.static(path.join(__dirname, '../client')));

// API Routes
app.use('/api/complaints', complaintRoutes);

// Connect to MongoDB and start server
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/maintainease';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed:', err.message);
  });
