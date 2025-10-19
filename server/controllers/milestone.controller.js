const Milestone = require('../models/milestone.model.js');
const Project = require('../models/project.model.js');
const { releaseMilestonePayment } = require('./wallet.controller.js');
const Notification = require('../models/Notification.js'); 

const submitMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const milestone = await Milestone.findById(milestoneId).populate({
            path: 'project',
            select: 'freelancer' 
        });

        if (!milestone) {
             return res.status(404).send("Milestone not found.");
        }

        if (!milestone.project) {
            console.error(`Milestone ${milestoneId} has a missing or null project reference.`);
            return res.status(404).send("Associated project not found for this milestone.");
        }

        if (!milestone.project.freelancer) { 
            console.error(`Attempted to submit milestone for project ${milestone.project._id} which has no freelancer assigned.`);
            return res.status(403).send("Forbidden: This project does not have a freelancer assigned to it yet.");
        }

        // ✅ --- THIS IS THE FIX ---
        // We must use .equals() to compare two ObjectId values.
        if (!milestone.project.freelancer.equals(req.user._id)) { 
        // ✅ --- END OF FIX ---
            return res.status(403).send("Forbidden: You are not the freelancer for this project.");
        }

        milestone.status = 'submitted_for_review';
        await milestone.save();
        res.status(200).json(milestone);
    } catch (err) {
        console.error('Error submitting milestone:', err);
        res.status(500).send("Error submitting milestone.");
    }
};

const reviewMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const { approvalStatus } = req.body;

        const milestone = await Milestone.findById(milestoneId).populate({
            path: 'project',
            select: 'clientId freelancer _id' 
        });

        if (!milestone) {
             return res.status(404).send("Milestone not found.");
        }

        if (!milestone.project) {
            console.error(`Milestone ${milestoneId} has a missing or null project reference.`);
            return res.status(404).send("Associated project not found for this milestone.");
        }
        
        // ✅ --- THIS IS THE SECOND FIX (Same bug, for the client) ---
        if (!milestone.project.clientId.equals(req.user._id)) {
        // ✅ --- END OF FIX ---
            return res.status(403).send("Forbidden: You are not the client for this project.");
        }

        if (approvalStatus === 'approved') {
            
            if (!milestone.project.freelancer) { 
                 console.error(`Attempted to approve milestone for project ${milestone.project._id} which has no freelancer assigned.`);
                 return res.status(400).send("Cannot approve milestone: No freelancer is assigned to this project.");
            }

            await releaseMilestonePayment(
                milestone.project.clientId,
                milestone.project.freelancer, 
                milestone.amount,
                milestone.title
            );

            milestone.status = 'approved';
            await milestone.save();

            await Notification.create({
                recipientId: milestone.project.freelancer, 
                type: 'payment_received',
                message: `Payment of ₹${milestone.amount.toFixed(2)} for milestone "${milestone.title}" has been released to your wallet.`,
                projectId: milestone.project._id
            });

            const allMilestones = await Milestone.find({ project: milestone.project._id });
            const allApproved = allMilestones.every(m => m.status === 'approved');

            if (allApproved) {
                await Project.findByIdAndUpdate(milestone.project._id, { status: 'completed' });
            }

        } else if (approvalStatus === 'revision_requested') {
            milestone.status = 'revision_requested';
            await milestone.save();
        } else {
            return res.status(400).send("Invalid approval status.");
        }

        res.status(200).json({ success: true, message: `Milestone status updated to ${milestone.status}`, data: milestone });

    } catch (err) {
        console.error('Error reviewing milestone:', err.message);
        if (err.message.includes('insufficient funds')) {
            return res.status(400).send("Payment failed: You have insufficient funds in your wallet. Please deposit funds to approve this milestone.");
        }
        res.status(500).send("Error reviewing milestone.");
    }
};

const getMilestonesForProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const milestones = await Milestone.find({ project: projectId }).sort({ createdAt: 'asc' });
        res.status(200).json({ success: true, milestones });
    } catch (err) {
        console.error('Error fetching milestones:', err.message);
        res.status(500).json({ success: false, message: 'Failed to fetch milestones.' });
    }
};

module.exports = {
    submitMilestone,
    reviewMilestone,
    getMilestonesForProject
};