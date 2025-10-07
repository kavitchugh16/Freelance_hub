
// // server/controllers/milestone.controller.js
// const Milestone = require('../models/milestone.model.js');
// const Project = require('../models/project.model.js'); // Assuming this model exists
// const { releaseMilestonePayment } = require('./wallet.controller.js'); // Import the payment function

// // ... (submitMilestone function remains unchanged) ...
// const submitMilestone = async (req, res) => {
//     try {
//         const { milestoneId } = req.params;
//         // NOTE: Assumes Project model has 'freelancerId' field after proposal acceptance
//         const milestone = await Milestone.findById(milestoneId).populate({
//             path: 'project',
//             select: 'freelancerId'
//         });

//         if (!milestone) {
//              return res.status(404).send("Milestone not found.");
//         }
//         if (milestone.project.freelancerId.toString() !== req.user._id) {
//             return res.status(403).send("Forbidden: You are not the freelancer for this project.");
//         }

//         milestone.status = 'submitted_for_review';
//         await milestone.save();
//         res.status(200).json(milestone);
//     } catch (err) {
//         console.error('Error submitting milestone:', err);
//         res.status(500).send("Error submitting milestone.");
//     }
// };


// // For Client to review and approve work
// const reviewMilestone = async (req, res) => {
//     try {
//         const { milestoneId } = req.params;
//         const { approvalStatus } = req.body; // 'approved' or 'revision_requested'

//         // NOTE: Assumes Project model has 'clientId' field
//         const milestone = await Milestone.findById(milestoneId).populate({
//             path: 'project',
//             select: 'clientId'
//         });

//         if (!milestone) {
//              return res.status(404).send("Milestone not found.");
//         }
//         if (milestone.project.clientId.toString() !== req.user._id) {
//             return res.status(403).send("Forbidden: You are not the client for this project.");
//         }

//         if (approvalStatus === 'approved') {
//             // --- PAYMENT AND COMPLETION LOGIC START ---
            
//             // Step 1: Attempt to release payment
//             await releaseMilestonePayment(
//                 milestone.project.clientId,
//                 milestone.project.freelancerId,
//                 milestone.amount,
//                 milestone.title
//             );

//             // Step 2: If payment is successful, update milestone status
//             milestone.status = 'approved';
//             await milestone.save();

//             // Step 3: Check if all milestones for the project are now approved
//             const allMilestones = await Milestone.find({ project: milestone.project._id });
//             const allApproved = allMilestones.every(m => m.status === 'approved');

//             if (allApproved) {
//                 // If all are approved, mark the project as completed
//                 await Project.findByIdAndUpdate(milestone.project._id, { status: 'completed' });
//             }
//             // --- PAYMENT AND COMPLETION LOGIC END ---

//         } else if (approvalStatus === 'revision_requested') {
//             milestone.status = 'revision_requested';
//             await milestone.save();
//         } else {
//             return res.status(400).send("Invalid approval status.");
//         }

//         res.status(200).json({ success: true, message: `Milestone status updated to ${milestone.status}`, data: milestone });

//     } catch (err) {
//         console.error('Error reviewing milestone:', err.message);
//         // Provide specific feedback if payment failed
//         if (err.message.includes('insufficient funds')) {
//             return res.status(400).send("Payment failed: You have insufficient funds in your wallet. Please deposit funds to approve this milestone.");
//         }
//         res.status(500).send("Error reviewing milestone.");
//     }
// };

// module.exports = {
//     submitMilestone,
//     reviewMilestone
// };
// server/controllers/milestone.controller.js
const Milestone = require('../models/milestone.model.js');
const Project = require('../models/project.model.js'); 
const { releaseMilestonePayment } = require('./wallet.controller.js'); 

const submitMilestone = async (req, res) => {
    try {
        const { milestoneId } = req.params;
        const milestone = await Milestone.findById(milestoneId).populate({
            path: 'project',
            select: 'freelancerId'
        });

        if (!milestone) {
             return res.status(404).send("Milestone not found.");
        }
        if (milestone.project.freelancerId.toString() !== req.user._id) {
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
            // ✅ UPDATED: Select both clientId and freelancerId to ensure payment function works
            select: 'clientId freelancerId' 
        });

        if (!milestone) {
             return res.status(404).send("Milestone not found.");
        }
        if (milestone.project.clientId.toString() !== req.user._id) {
            return res.status(403).send("Forbidden: You are not the client for this project.");
        }

        if (approvalStatus === 'approved') {
            await releaseMilestonePayment(
                milestone.project.clientId,
                milestone.project.freelancerId,
                milestone.amount,
                milestone.title
            );

            milestone.status = 'approved';
            await milestone.save();

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

// ✅ ADDED: New function to get all milestones for a project
const getMilestonesForProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        // You might want to add a check here to ensure the user (client or freelancer) is part of the project
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
    getMilestonesForProject // ✅ ADDED: Export the new function
};