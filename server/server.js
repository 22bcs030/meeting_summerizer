const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');

// Import routes
const summarizeRoutes = require('./routes/summarize');
const emailRoutes = require('./routes/email');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB with fallback to local database if connection fails
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Attempting to connect to local MongoDB...');
    
    try {
      // Try connecting to a local MongoDB instance
      await mongoose.connect('mongodb://localhost:27017/meeting-notes');
      console.log('Connected to local MongoDB');
      return true;
    } catch (localErr) {
      console.error('Could not connect to local MongoDB:', localErr);
      return false;
    }
  }
};

connectToMongoDB();

// Routes
app.use('/api/summarize', summarizeRoutes);
app.use('/api/email', emailRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Meeting Notes Summarizer API is running');
});

// API root route for connection testing
app.get('/api', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API is running',
    aiStatus: process.env.AI_API_KEY && process.env.AI_API_KEY !== 'your-api-key' 
      ? 'API key configured' 
      : 'Using fallback mock AI'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
