// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Admin = require('./models/Admin'); // Make sure this path points to your Admin model
const ChatRoute = require('./routes/chat');
const authController = require('./controllers/authController');
const dialogflowController = require('./controllers/dialogflowController');
const { createContact, getContacts, deleteContact } = require('./controllers/contactController');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// MongoDB Connection and Admin Creation
const initializeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (!existingAdmin) {
      // Create new admin
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
      });
      
      await admin.save();
      console.log('Default admin user created');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error('Initialization error:', err);
    process.exit(1); // Exit if we can't create admin or connect to DB
  }
};

// Initialize database and admin
initializeAdmin();

// Routes
app.use('/api/chat', ChatRoute);
app.post('/api/admin/login', authController.login);
app.get('/api/admin/intents', authController.verifyToken, dialogflowController.getIntents);
app.post('/api/admin/intents', authController.verifyToken, dialogflowController.createIntent);
app.get('/api/admin/analytics', authController.verifyToken, dialogflowController.getChatAnalytics);
app.delete('/api/admin/intents/:encodedIntentName', authController.verifyToken, dialogflowController.deleteIntent);
app.get('/api/admin/intent/:id', dialogflowController.getIntent);
app.put('/api/admin/intent-update/:id', dialogflowController.updateIntent);
app.post('/api/contact', createContact);
app.get('/api/contact', authController.verifyToken, getContacts);
app.delete("/api/contact/:id", authController.verifyToken, deleteContact);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));