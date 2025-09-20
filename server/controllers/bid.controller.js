// In server/src/controllers/bid.controller.js

const Bid = require('../models/bid.model.js');
const Project = require('../models/project.model.js');

// --- FUNCTION 1: Create a New Bid ---
const createBid = async (req, res) => {
    try {
        // Check if the user is a freelancer
        if (req.userRole !== 'freelancer') {
            return res.status(403).send("Forbidden: Only freelancers can place bids.");
        }

        const { projectId, bidAmount, proposalText } = req.body;

        // Check if the freelancer has already bid on this project
        const existingBid = await Bid.findOne({ project: projectId, freelancer: req.userId });
        if (existingBid) {
            return res.status(409).send("You have already placed a bid on this project.");
        }

        const newBid = new Bid({
            project: projectId,
            freelancer: req.userId,
            bidAmount,
            proposalText
        });

        await newBid.save();
        res.status(201).json(newBid);

    } catch (err) {
        res.status(500).send("Something went wrong while creating the bid.");
    }
};

// --- FUNCTION 2: Get All Bids for a Specific Project ---
const getBidsForProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        
        // First, find the project to verify ownership
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).send("Project not found.");
        }

        // Check if the person requesting the bids is the client who posted the project
        // Note: project.client is an ObjectId, so we must convert it to a string to compare.
        if (project.client.toString() !== req.userId) {
            return res.status(403).send("Forbidden: You are not the owner of this project.");
        }

        // If they are the owner, fetch all bids and populate freelancer details
        const bids = await Bid.find({ project: projectId }).populate('freelancer', 'username skills profilePicture');
        
        res.status(200).json(bids);

    } catch (err) {
        res.status(500).send("Something went wrong while fetching bids.");
    }
};

module.exports = {
    createBid,
    getBidsForProject
};