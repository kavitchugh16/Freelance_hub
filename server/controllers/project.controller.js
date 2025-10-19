
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Milestone = require('../models/milestone.model');
const Notification = require('../models/Notification');

// --- Create Project ---
const createProject = async (req, res) => {
  try {
    const projectData = { ...req.body, clientId: req.user._id };
    const project = await Project.create(projectData);
    res.status(201).json({ success: true, message: 'Project created successfully!', project });
  } catch (err) {
    console.error('❌ createProject error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: `Invalid project data: ${messages.join(', ')}` });
    }
    res.status(500).json({ success: false, message: 'Server error while creating the project.' });
  }
};

// --- Get All Projects (Public or Filtered) ---
const getProjects = async (req, res) => {
  try {
    const matchStage = {};
    if (req.query.category) matchStage.category = req.query.category;
    if (req.query.status) matchStage.status = req.query.status;
    const projects = await Project.find(matchStage)
      .populate('clientId', 'username country')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    console.error('❌ getProjects error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching projects.' });
  }
};


// --- Get Projects for the Logged-in Client ---
const getMyProjects = async (req, res) => {
    try {
        const clientId = new mongoose.Types.ObjectId(req.user._id);
        const projects = await Project.aggregate([
            { $match: { clientId: clientId } },
            {
                $lookup: {
                    from: 'milestones',
                    localField: '_id',
                    foreignField: 'project', 
                    as: 'milestonesData'
                }
            },
            {
                $addFields: {
                    totalMilestones: { $size: '$milestonesData' },
                    completedMilestones: {
                        $size: {
                            $filter: {
                                input: '$milestonesData',
                                as: 'milestone',
                                cond: { $eq: ['$$milestone.status', 'approved'] }
                            }
                        }
                    }
                }
            },
            { $project: { milestonesData: 0 } },
            { $sort: { createdAt: -1 } }
        ]);
        await Project.populate(projects, { path: 'clientId', select: 'username' });
        res.status(200).json({
            success: true,
            count: projects.length,
            projects,
        });
    } catch (error) {
        console.error("Error in getMyProjects controller: ", error);
        res.status(500).json({ success: false, message: "Server error while fetching your projects." });
    }
};


// --- Get Project by ID ---
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'username email company')
      .populate({ path: 'proposals', populate: { path: 'freelancerId', select: 'username email skills' } });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    res.status(200).json({ success: true, project });
  } catch (err) {
    console.error('❌ getProjectById error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching project details.' });
  }
};

// --- Accept Proposal ---
const acceptProposal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { proposalId, milestoneInputs } = req.body;
    const project = await Project.findById(req.params.id).session(session);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (!project.clientId.equals(req.user._id)) return res.status(403).json({ success: false, message: 'Not authorized.' });
    if (project.status !== 'open') return res.status(400).json({ success: false, message: 'Project is not open.' });

    const proposal = await Proposal.findById(proposalId).session(session);
    if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found.' });

    const totalAmount = proposal.bid.amount;
    const size = milestoneInputs.length;
    if (!size || size < 1) throw new Error("Milestone details must be provided.");

    const remainder = 100 % size;
    const basePercentage = Math.floor(100 / size);
    const newMilestones = milestoneInputs.map((input, index) => {
      const percentage = (index === 0) ? basePercentage + remainder : basePercentage;
      const amount = Math.round((totalAmount * percentage)) / 100;
      return { project: project._id, title: input.title, description: input.description, amount, status: 'pending' };
    });

    await Milestone.insertMany(newMilestones, { session });
    proposal.status = 'accepted';
    await proposal.save({ session });
    await Proposal.updateMany({ projectId: project._id, _id: { $ne: proposalId } }, { $set: { status: 'declined' } }, { session });
    
    project.freelancer = proposal.freelancerId;
    project.finalAmount = totalAmount;
    project.status = 'in-progress';
    await project.save({ session });

    await Notification.create([{
        recipientId: proposal.freelancerId,
        projectId: project._id,
        message: `Congratulations! Your bid for the project "${project.title}" has been accepted.`,
        type: 'bid_accepted',
    }], { session });

    await session.commitTransaction();
    res.status(200).json({ success: true, message: 'Proposal accepted and milestones created.', project });
  } catch (err) {
    await session.abortTransaction();
    console.error('❌ acceptProposal error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error while accepting proposal.' });
  } finally {
    session.endSession();
  }
};

// --- Get Projects for a specific Freelancer ---
const getFreelancerProjects = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    // --- ✅ FIX: Changed 'freelancerId' to 'freelancer' to match the schema ---
    const projects = await Project.find({ freelancer: freelancerId })
      .populate('clientId', 'username')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error('❌ getFreelancerProjects error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching freelancer projects.' });
  }
};

module.exports = {
  createProject,
  getProjects,
  getMyProjects,
  getProjectById,
  acceptProposal,
  getFreelancerProjects
};