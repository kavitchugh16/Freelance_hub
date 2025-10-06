const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Routes
const authRoute = require('./routes/auth.route.js');

const projectRoute = require('./routes/project.route.js');
const proposalRoute = require('./routes/proposal.route.js');



dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Route mounting
app.use('/api/auth', authRoute);

app.use('/api/projects', projectRoute);
app.use('/api/proposals', proposalRoute);



// Connect to MongoDB
const connectDB = async () => {
  try {
    const MONGODB_URI =
      'mongodb+srv://ajitesh:dbuser%40123@cluster0.04bem14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Start server
app.listen(8080, () => {
  connectDB();
  console.log('Backend server is running on port 8080!');
});
