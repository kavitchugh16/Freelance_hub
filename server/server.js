// In server/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Import ALL your route files
const authRoute = require('./routes/auth.route.js');
const projectRoute = require('./routes/project.route.js');
const bidRoute = require('./routes/bid.route.js');
const milestoneRoute = require('./routes/milestone.route.js');

const app = express();

// --- Middlewares ---
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
app.use(express.json());
app.use(cookieParser());

// --- API Routes ---
app.use('/api/auth', authRoute);
app.use('/api/projects', projectRoute);
app.use('/api/bids', bidRoute);
app.use('/api/milestones', milestoneRoute);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};

app.listen(8080, () => {
    connectDB();
    console.log("Backend server is running on port 8080!");
});