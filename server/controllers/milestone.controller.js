// Create new file: server/src/controllers/milestone.controller.js

const Milestone = require('../models/milestone.model.js');
const Project = require('../models/project.model.js');

// For Freelancer to submit work
const submitMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const milestone = await Milestone.findById(milestoneId).populate('project');

        // Ensure the user submitting is the assigned freelancer for this project
        if (milestone.project.freelancer.toString() !== req.userId) {
            return res.status(403).send("Forbidden: You are not the freelancer for this project.");
        }

        milestone.status = 'submitted_for_review';
        await milestone.save();
        res.status(200).json(milestone);
    } catch (err) {
        res.status(500).send("Error submitting milestone.");
    }
};

// For Client to review and approve work
const reviewMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const { approvalStatus } = req.body; // expecting 'approved' or 'revision_requested'

        const milestone = await Milestone.findById(milestoneId).populate('project');

        // Ensure the user reviewing is the client for this project
        if (milestone.project.client.toString() !== req.userId) {
            return res.status(403).send("Forbidden: You are not the client for this project.");
        }

        if (approvalStatus === 'approved') {
            milestone.status = 'approved';
            // Here we would trigger the payment release
            // For now, we just update the status. We'll add payment logic next.
            // releaseMilestonePayment(milestone.project.client, milestone.project.freelancer, milestone.amount);
        } else if (approvalStatus === 'revision_requested') {
            milestone.status = 'revision_requested';
        } else {
            return res.status(400).send("Invalid approval status.");
        }

        await milestone.save();
        res.status(200).json(milestone);

    } catch (err) {
        res.status(500).send("Error reviewing milestone.");
    }
};


module.exports = {
    submitMilestone,
    reviewMilestone
};

