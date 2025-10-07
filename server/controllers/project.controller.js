
// const mongoose = require('mongoose');
// const Project = require('../models/Project');
// const Proposal = require('../models/Proposal');
// const Milestone = require('../models/milestone.model');

// // ... (createProject function remains unchanged) ...
// exports.createProject = async (req, res) => {
//   try {
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({ success: false, message: 'Authentication Error: User information is missing. Please log in again.' });
//     }
//     if (req.user.role !== 'client') {
//       return res.status(403).json({ success: false, message: 'Forbidden: Only clients can create projects.' });
//     }
//     const projectData = { ...req.body, clientId: req.user._id };
//     const project = await Project.create(projectData);
//     res.status(201).json({ success: true, message: 'Project created successfully!', project });
//   } catch (err) {
//     console.error('❌ createProject error:', err);
//     if (err.name === 'ValidationError') {
//       const messages = Object.values(err.errors).map(val => val.message);
//       return res.status(400).json({ success: false, message: `Invalid project data provided. Errors: ${messages.join(', ')}` });
//     }
//     res.status(500).json({ success: false, message: 'A server error occurred while creating the project.' });
//   }
// };


// // --- MODIFIED FUNCTION ---

// /**
//  * @desc    Get all projects and their milestone progress
//  * @route   GET /api/projects
//  * @access  Public
//  */
// exports.getAllProjects = async (req, res) => {
//   try {
//     // --- Build the initial match stage for filtering ---
//     const matchStage = {};
//     if (req.query.category) matchStage.category = req.query.category;
//     if (req.query.status) matchStage.status = req.query.status;
//     if (req.query.skill) matchStage.requiredSkills = { $in: [new RegExp(req.query.skill, 'i')] };
//     if (req.query.search) matchStage.$text = { $search: req.query.search };

//     const projects = await Project.aggregate([
//       // 1. Filter projects based on query parameters
//       { $match: matchStage },
//       // 2. Join with milestones collection to get milestone data for each project
//       {
//         $lookup: {
//           from: 'milestones', // The collection name for the Milestone model
//           localField: '_id',
//           foreignField: 'project',
//           as: 'milestonesData'
//         }
//       },
//       // 3. Join with users collection to get client info
//       {
//         $lookup: {
//           from: 'users', // The collection name for the User model
//           localField: 'clientId',
//           foreignField: '_id',
//           as: 'clientInfo'
//         }
//       },
//       // 4. Add the new progress fields
//       {
//         $addFields: {
//           totalMilestones: { $size: '$milestonesData' },
//           completedMilestones: {
//             $size: {
//               $filter: {
//                 input: '$milestonesData',
//                 as: 'milestone',
//                 cond: { $eq: ['$$milestone.status', 'approved'] }
//               }
//             }
//           },
//           // Replace clientId with the populated client object
//           clientId: { $arrayElemAt: ['$clientInfo', 0] }
//         }
//       },
//       // 5. Clean up the response: remove extra fields
//       {
//         $project: {
//           milestonesData: 0, // Remove the large milestones array
//           clientInfo: 0      // Remove the temporary client info array
//         }
//       },
//       // 6. Sort by most recently created
//       { $sort: { createdAt: -1 } }
//     ]);

//     res.status(200).json({
//       success: true,
//       count: projects.length,
//       projects,
//     });
//   } catch (err) {
//     console.error('❌ getAllProjects error:', err);
//     res.status(500).json({ success: false, message: 'Server error while fetching projects.' });
//   }
// };

// // ... (getProjectById and acceptProposal functions remain unchanged) ...
// exports.getProjectById = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id)
//       .populate('clientId', 'username email company')
//       .populate({ path: 'proposals', populate: { path: 'freelancerId', select: 'username email skills' } });
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found.' });
//     }
//     res.status(200).json({ success: true, project });
//   } catch (err) {
//     console.error('❌ getProjectById error:', err);
//     res.status(500).json({ success: false, message: 'Server error while fetching project details.' });
//   }
// };
// exports.acceptProposal = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { proposalId, milestoneInputs } = req.body;
//     const project = await Project.findById(req.params.id).session(session);
//     if (!project) {
//       return res.status(404).json({ success: false, message: 'Project not found.' });
//     }
//     if (!project.clientId.equals(req.user._id)) {
//       return res.status(403).json({ success: false, message: 'Not authorized to accept proposals for this project.' });
//     }
//     if (project.status !== 'open') {
//       return res.status(400).json({ success: false, message: 'This project is not open for proposals.' });
//     }
//     const proposal = await Proposal.findById(proposalId).session(session);
//     if (!proposal) {
//       return res.status(404).json({ success: false, message: 'Proposal not found.' });
//     }
//     const totalAmount = proposal.bid.amount;
//     const size = milestoneInputs.length;
//     if (!size || size < 1) {
//         throw new Error("Milestone details must be provided.");
//     }
//     const remainder = 100 % size;
//     const basePercentage = Math.floor(100 / size);
//     const newMilestones = milestoneInputs.map((input, index) => {
//         const percentage = (index === 0) ? basePercentage + remainder : basePercentage;
//         const amount = Math.round((totalAmount * percentage)) / 100;
//         return { project: project._id, title: input.title, description: input.description, amount: amount, status: 'pending' };
//     });
//     await Milestone.insertMany(newMilestones, { session });
//     proposal.status = 'accepted';
//     await proposal.save({ session });
//     await Proposal.updateMany({ projectId: project._id, _id: { $ne: proposalId } }, { $set: { status: 'declined' } }, { session });
//     project.freelancerId = proposal.freelancerId;
//     project.finalAmount = totalAmount;
//     project.status = 'in-progress';
//     await project.save({ session });
//     await session.commitTransaction();
//     res.status(200).json({ success: true, message: 'Proposal accepted and project milestones created successfully.', project });
//   } catch (err) {
//     await session.abortTransaction();
//     console.error('❌ acceptProposal error:', err);
//     res.status(500).json({ success: false, message: err.message || 'Server error while accepting proposal.' });
//   } finally {
//     session.endSession();
//   }
// };

const mongoose = require('mongoose');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Milestone = require('../models/milestone.model');

// --- Create Project ---
const createProject = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Authentication Error: User information is missing. Please log in again.' });
    }
    if (req.user.role !== 'client') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only clients can create projects.' });
    }
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

// --- Get All Projects ---
const getProjects = async (req, res) => {
  try {
    const matchStage = {};
    if (req.query.category) matchStage.category = req.query.category;
    if (req.query.status) matchStage.status = req.query.status;
    if (req.query.skill) matchStage.requiredSkills = { $in: [new RegExp(req.query.skill, 'i')] };
    if (req.query.search) matchStage.$text = { $search: req.query.search };

    const projects = await Project.aggregate([
      { $match: matchStage },
      { $lookup: { from: 'milestones', localField: '_id', foreignField: 'project', as: 'milestonesData' } },
      { $lookup: { from: 'users', localField: 'clientId', foreignField: '_id', as: 'clientInfo' } },
      { $addFields: {
          totalMilestones: { $size: '$milestonesData' },
          completedMilestones: { $size: { $filter: { input: '$milestonesData', as: 'm', cond: { $eq: ['$$m.status', 'approved'] } } } },
          clientId: { $arrayElemAt: ['$clientInfo', 0] }
        } 
      },
      { $project: { milestonesData: 0, clientInfo: 0 } },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    console.error('❌ getProjects error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching projects.' });
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
    project.freelancerId = proposal.freelancerId;
    project.finalAmount = totalAmount;
    project.status = 'in-progress';
    await project.save({ session });

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

// --- Get Freelancer Projects ---
const getFreelancerProjects = async (req, res) => {
  try {
    const freelancerId = req.user._id;
    const projects = await Project.find({ freelancerId })
      .populate('clientId', 'username')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    console.error('❌ getFreelancerProjects error:', err);
    res.status(500).json({ success: false, message: 'Server error while fetching freelancer projects.' });
  }
};

// ✅ Export all functions properly
module.exports = {
  createProject,
  getProjects,
  getProjectById,
  acceptProposal,
  getFreelancerProjects
};
