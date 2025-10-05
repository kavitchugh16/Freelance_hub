const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth.route.js');
const userRoute = require('./routes/user.route.js');
const projectRoute = require('./routes/project.route.js');
const bidRoute = require('./routes/bid.route.js');
const milestoneRoute = require('./routes/milestone.route.js');
const paymentRoute = require('./routes/payment.route.js');
const reviewRoute = require('./routes/review.route.js');


const app = express();
dotenv.config();
app.use(cors({ origin: "http://localhost:5173", credentials: true })); 
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/projects', projectRoute);
app.use('/api/bids', bidRoute);
app.use('/api/milestones', milestoneRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/reviews', reviewRoute);


const connectDB = async () => {
    try {
        // Hardcoded MongoDB URI as requested (password '@' encoded as %40)
        const MONGODB_URI = 'mongodb+srv://ajitesh:dbuser%40123@cluster0.04bem14.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(MONGODB_URI);
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