// In server/src/controllers/review.controller.js

const Review = require('../models/review.model.js');
const Project = require('../models/project.model.js');

const createReview = async (req, res) => {
    try {
        const { projectId, rating, comment } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).send("Project not found.");

        // 1. Check if the project is completed
        if (project.status !== 'completed') {
            return res.status(403).send("You can only review completed projects.");
        }

        // 2. Determine who is the reviewer and who is being reviewed
        const reviewerId = req.userId;
        const isClient = project.client.toString() === reviewerId;
        const isFreelancer = project.freelancer.toString() === reviewerId;

        if (!isClient && !isFreelancer) {
            return res.status(403).send("You were not part of this project.");
        }

        const revieweeId = isClient ? project.freelancer : project.client;

        // 3. Check if this user has already reviewed for this project
        const existingReview = await Review.findOne({ project: projectId, reviewer: reviewerId });
        if (existingReview) {
            return res.status(409).send("You have already submitted a review for this project.");
        }

        const newReview = new Review({
            project: projectId,
            reviewer: reviewerId,
            reviewee: revieweeId,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(500).send("Error creating review.");
    }
};

const getReviewsForUser = async (req, res) => {
    try {
        // Fetches all reviews where the specified user was the one being reviewed
        const reviews = await Review.find({ reviewee: req.params.userId }).populate('reviewer', 'username profilePicture');
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).send("Error fetching reviews.");
    }
};

module.exports = {
    createReview,
    getReviewsForUser
};