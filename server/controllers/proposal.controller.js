// // server/controllers/proposal.controller.js
// const Proposal = require('../models/Proposal');
// const Project = require('../models/Project');
// const Notification = require('../models/Notification'); // ⬅️ NEW Import

// /**
//  * @desc   Freelancer submits a new proposal/bid for a project
//  * @route POST /api/proposals
//  * @access Private (Freelancer)
//  */
// exports.createProposal = async (req, res) => {
//     try {
//         const freelancerId = req.user._id;
//         const { projectId, coverLetter, bid, estimatedCompletionDate, proposedApproach } = req.body;
        
//         if (req.user.role !== 'freelancer') {
//             return res.status(403).json({ success: false, message: 'Only freelancers can submit proposals.' });
//         }

//         // 1. Validate Project existence and status
//         const project = await Project.findById(projectId);
//         if (!project || project.status !== 'open') {
//             return res.status(404).json({ success: false, message: 'Project not found or not open for bidding.' });
//         }

//         // 2. Create the Proposal (Allowing multiple bids from the same freelancer)
//         const proposalData = {
//             ...req.body,
//             freelancerId: freelancerId,
//             status: 'submitted'
//         };

//         const proposal = await Proposal.create(proposalData);

//         // 3. Update the Project to track the new proposal (if necessary, assuming Project model has a 'proposals' array)
//         if (!project.proposals.includes(proposal._id)) {
//              project.proposals.push(proposal._id);
//              await project.save();
//         }

//         // 4. Create Notification for the Client
//         const clientMessage = `New bid received on your project: "${project.title}". Bid Amount: ${bid.amount} ${bid.currency}.`;

//         await Notification.create({
//             recipientId: project.clientId, // The project creator is the client
//             proposalId: proposal._id,
//             projectId: projectId,
//             message: clientMessage,
//             type: 'new_bid'
//         });

//         res.status(201).json({
//             success: true,
//             message: 'Proposal submitted successfully. Client notified.',
//             proposal,
//         });

//     } catch (err) {
//         console.error('❌ createProposal error:', err);
//         res.status(500).json({ success: false, message: 'Server error while submitting proposal.' });
//     }
// };


// /**
//  * @desc   Get all proposals for a specific project (Client view)
//  * @route GET /api/proposals/project/:projectId
//  * @access Private (Client)
//  */
// exports.getProposalsByProject = async (req, res) => {
//     try {
//         const projectId = req.params.projectId;
        
//         // Ensure the authenticated user owns the project
//         const project = await Project.findById(projectId);
//         if (!project || project.clientId.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ success: false, message: 'Not authorized to view proposals for this project.' });
//         }

//         const proposals = await Proposal.find({ projectId })
//             .populate('freelancerId', 'username email skills country'); // Get freelancer details

//         res.status(200).json({ success: true, proposals });
//     } catch (err) {
//         console.error('❌ getProposalsByProject error:', err);
//         res.status(500).json({ success: false, message: 'Server error while fetching proposals.' });
//     }
// };

// // You'll need other functions like getMyProposals, updateProposal, etc.
const mongoose = require('mongoose');
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// ------------------ CREATE PROPOSAL ------------------
exports.createProposal = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const { projectId } = req.body;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ success: false, message: 'Only freelancers can submit proposals.' });
    }

    const project = await Project.findById(projectId);
    if (!project || project.status !== 'open') {
      return res.status(404).json({ success: false, message: 'Project not found or not open for bidding.' });
    }

    const proposal = await Proposal.create({ ...req.body, freelancerId, status: 'submitted' });

    if (!project.proposals.includes(proposal._id)) {
      project.proposals.push(proposal._id);
      await project.save();
    }

    const clientMessage = `New bid received on your project: "${project.title}". Bid Amount: ${req.body.bid.amount} ${req.body.bid.currency}.`;
    await Notification.create({
      recipientId: project.clientId,
      proposalId: proposal._id,
      projectId,
      message: clientMessage,
      type: 'new_bid',
    });

    res.status(201).json({ success: true, message: 'Proposal submitted successfully. Client notified.', proposal });

  } catch (err) {
    console.error('❌ createProposal error:', err);
    res.status(500).json({ success: false, message: 'Server error while submitting proposal.' });
  }
};

// ------------------ GET PROPOSALS BY PROJECT ------------------
exports.getProposalsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project || project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view proposals for this project.' });
    }

    const proposals = await Proposal.find({ projectId }).populate('freelancerId', 'username email skills country');

    res.status(200).json({ success: true, proposals });

  } catch (err) {
    console.error('❌ getProposalsByProject error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching proposals.' });
  }
};

// ------------------ APPROVE PROPOSAL ------------------
exports.approveProposal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { proposalId } = req.params;
    const proposal = await Proposal.findById(proposalId).session(session);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found.' });

    const project = await Project.findById(proposal.projectId).session(session);
    if (!project || project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to approve proposals for this project.' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This project is no longer open for bidding.' });
    }

    // Update project & proposal
    project.freelancerId = proposal.freelancerId;
    project.finalAmount = proposal.bid.amount;
    project.status = 'in-progress';
    proposal.status = 'accepted';

    await Promise.all([
      project.save({ session }),
      proposal.save({ session }),
    ]);

    // Decline other proposals
    await Proposal.updateMany(
      { projectId: project._id, _id: { $ne: proposalId } },
      { $set: { status: 'declined' } },
      { session }
    );

    // Notify freelancer
    await Notification.create([{
      recipientId: proposal.freelancerId,
      projectId: project._id,
      message: `Congratulations! Your bid for the project "${project.title}" has been accepted.`,
      type: 'bid_accepted',
    }], { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: 'Proposal approved and freelancer notified.' });

  } catch (err) {
    await session.abortTransaction();
    console.error('❌ approveProposal error:', err);
    res.status(500).json({ success: false, message: 'Server error while approving proposal.' });
  } finally {
    session.endSession();
  }
};
