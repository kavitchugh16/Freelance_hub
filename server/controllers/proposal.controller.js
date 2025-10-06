// server/controllers/proposal.controller.js
const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Notification = require('../models/Notification'); // ⬅️ NEW Import

/**
 * @desc   Freelancer submits a new proposal/bid for a project
 * @route POST /api/proposals
 * @access Private (Freelancer)
 */
exports.createProposal = async (req, res) => {
    try {
        const freelancerId = req.user._id;
        const { projectId, coverLetter, bid, estimatedCompletionDate, proposedApproach } = req.body;
        
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: 'Only freelancers can submit proposals.' });
        }

        // 1. Validate Project existence and status
        const project = await Project.findById(projectId);
        if (!project || project.status !== 'open') {
            return res.status(404).json({ success: false, message: 'Project not found or not open for bidding.' });
        }

        // 2. Create the Proposal (Allowing multiple bids from the same freelancer)
        const proposalData = {
            ...req.body,
            freelancerId: freelancerId,
            status: 'submitted'
        };

        const proposal = await Proposal.create(proposalData);

        // 3. Update the Project to track the new proposal (if necessary, assuming Project model has a 'proposals' array)
        if (!project.proposals.includes(proposal._id)) {
             project.proposals.push(proposal._id);
             await project.save();
        }

        // 4. Create Notification for the Client
        const clientMessage = `New bid received on your project: "${project.title}". Bid Amount: ${bid.amount} ${bid.currency}.`;

        await Notification.create({
            recipientId: project.clientId, // The project creator is the client
            proposalId: proposal._id,
            projectId: projectId,
            message: clientMessage,
            type: 'new_bid'
        });

        res.status(201).json({
            success: true,
            message: 'Proposal submitted successfully. Client notified.',
            proposal,
        });

    } catch (err) {
        console.error('❌ createProposal error:', err);
        res.status(500).json({ success: false, message: 'Server error while submitting proposal.' });
    }
};


/**
 * @desc   Get all proposals for a specific project (Client view)
 * @route GET /api/proposals/project/:projectId
 * @access Private (Client)
 */
exports.getProposalsByProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        
        // Ensure the authenticated user owns the project
        const project = await Project.findById(projectId);
        if (!project || project.clientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to view proposals for this project.' });
        }

        const proposals = await Proposal.find({ projectId })
            .populate('freelancerId', 'username email skills country'); // Get freelancer details

        res.status(200).json({ success: true, proposals });
    } catch (err) {
        console.error('❌ getProposalsByProject error:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching proposals.' });
    }
};

// You'll need other functions like getMyProposals, updateProposal, etc.