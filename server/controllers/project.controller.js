const mongoose = require('mongoose');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');

/**
 * @desc    Create a new project (Client only)
 * @route   POST /api/projects
 * @access  Private (Client)
 */
exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ success: false, message: 'Only clients can create projects.' });
    }

    const projectData = {
      ...req.body,
      clientId: req.user._id,
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      project,
    });
  } catch (err) {
    console.error('❌ createProject error:', err);
    res.status(500).json({ success: false, message: 'Server error while creating project.' });
  }
};

/**
 * @desc    Get all projects (Public)
 * @route   GET /api/projects
 * @access  Public
 */
exports.getAllProjects = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.skill) filters.requiredSkills = { $in: [req.query.skill] };
    if (req.query.search) filters.$text = { $search: req.query.search };

    const projects = await Project.find(filters)
      .populate('clientId', 'username email company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (err) {
    console.error('❌ getAllProjects error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching projects.' });
  }
};

/**
 * @desc    Get single project details
 * @route   GET /api/projects/:id
 * @access  Public
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'username email company')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancerId',
          select: 'username email skills',
        },
      });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    console.error('❌ getProjectById error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching project details.' });
  }
};

/**
 * @desc    Client accepts a proposal
 * @route   POST /api/projects/:id/accept-proposal
 * @access  Private (Client)
 */
exports.acceptProposal = async (req, res) => {
  try {
    const { proposalId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Ensure client owns the project
    if (!project.clientId.equals(mongoose.Types.ObjectId(req.user._id))) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept proposals for this project.' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found.' });
    }

    // Update proposal status
    proposal.status = 'accepted';
    await proposal.save();

    // Update project status
    project.status = 'in-progress';
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Proposal accepted successfully.',
      project,
      proposal,
    });
  } catch (err) {
    console.error('❌ acceptProposal error:', err);
    res.status(500).json({ success: false, message: 'Server error while accepting proposal.' });
  }
};
