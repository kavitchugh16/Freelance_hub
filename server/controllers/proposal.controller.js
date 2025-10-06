const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

/**
 * @desc    Create a new proposal (Freelancer only)
 * @route   POST /api/proposals/:projectId
 * @access  Private (Freelancer)
 */
exports.createProposal = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ success: false, message: 'Only freelancers can submit proposals.' });
    }

    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const proposalData = {
      projectId,
      freelancerId: req.user._id,
      coverLetter: req.body.coverLetter,
      bid: req.body.bid,
      estimatedCompletionDate: req.body.estimatedCompletionDate,
      proposedApproach: req.body.proposedApproach || '',
      relevantPortfolioItems: req.body.relevantPortfolioItems || [],
      clarifyingQuestions: req.body.clarifyingQuestions || [],
    };

    const proposal = await Proposal.create(proposalData);

    // Add to project's proposals array
    project.proposals.push(proposal._id);
    await project.save();

    // Create a notification for the client
    await Notification.create({
      userId: project.clientId,
      title: `New bid for "${project.title}"`,
      message: `${req.user.username} submitted a bid of ${proposal.bid.amount} ${proposal.bid.currency}`,
      data: { projectId: project._id, proposalId: proposal._id },
    });

    res.status(201).json({ success: true, message: 'Proposal submitted successfully.', proposal });
  } catch (err) {
    console.error('❌ createProposal error:', err);
    res.status(500).json({ success: false, message: 'Server error while submitting proposal.' });
  }
};

/**
 * @desc    Get all proposals for a specific project
 * @route   GET /api/proposals/project/:projectId
 * @access  Private (Client or Freelancer)
 */
exports.getProposalsForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' });
    }

    const proposals = await Proposal.find({ projectId })
      .populate('freelancerId', 'username email portfolio skills')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: proposals.length, proposals });
  } catch (err) {
    console.error('❌ getProposalsForProject error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching proposals.' });
  }
};

/**
 * @desc    Get all proposals submitted by logged-in freelancer
 * @route   GET /api/proposals/my
 * @access  Private (Freelancer)
 */
exports.getProposalsByFreelancer = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ success: false, message: 'Access denied. Only freelancers allowed.' });
    }

    const freelancerId = req.user._id;

    const proposals = await Proposal.find({ freelancerId })
      .populate('projectId', 'title description category')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: proposals.length, proposals });
  } catch (err) {
    console.error('❌ getProposalsByFreelancer error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching your proposals.' });
  }
};
