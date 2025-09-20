// In server/src/controllers/project.controller.js

const Project = require('../models/project.model.js');
const Bid = require('../models/bid.model.js'); // We need this for the acceptBid function

const createProject = async (req, res) => {
    try {
        if (req.userRole !== 'client') {
            return res.status(403).send("Forbidden: Only clients can post new projects.");
        }
        const { title, description, skills, budget } = req.body;
        const newProject = new Project({
            client: req.userId,
            title,
            description,
            skills,
            budget
        });
        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        res.status(500).send("Something went wrong while creating the project.");
    }
};

const getProjects = async (req, res) => {
    try {
        const filters = { status: 'open' };
        if (req.query.search) {
            filters.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.skills) {
            filters.skills = { $in: req.query.skills.split(',') };
        }
        const projects = await Project.find(filters).populate('client', 'username profilePicture');
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).send("Something went wrong while fetching projects.");
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('client', 'username profilePicture country');
        if (!project) {
            return res.status(404).send("Project not found.");
        }
        res.status(200).json(project);
    } catch (err) {
        res.status(500).send("Something went wrong while fetching the project.");
    }
};

const acceptBid = async (req, res) => {
    try {
        const { projectId, bidId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) return res.status(404).send("Project not found.");
        
        if (project.client.toString() !== req.userId) {
            return res.status(403).send("Forbidden: You are not the owner of this project.");
        }
        
        const acceptedBid = await Bid.findById(bidId);
        if (!acceptedBid) return res.status(404).send("Bid not found.");

        project.freelancer = acceptedBid.freelancer;
        project.status = 'in_progress';
        await project.save();

        acceptedBid.status = 'accepted';
        await acceptedBid.save();

        await Bid.updateMany(
            { project: projectId, _id: { $ne: bidId } },
            { status: 'rejected' }
        );

        res.status(200).json(project);
    } catch (err) {
        res.status(500).send("Something went wrong while accepting the bid.");
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    acceptBid
};