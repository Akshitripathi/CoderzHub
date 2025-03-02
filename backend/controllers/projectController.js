const Project = require('../models/project');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.createProject = async (req, res) => {
    try {
        const { name, description, admin, collaborators, files_folder, languages_used, visibility, tags } = req.body;

        const adminUser = await User.findById(admin);
        if (!adminUser) {
            return res.status(404).json({ message: 'Admin user not found' });
        }

        const collaboratorIds = collaborators.map(collab => new mongoose.Types.ObjectId(collab));

        const project = new Project({
            name,
            description,
            admin: new mongoose.Types.ObjectId(admin),
            collaborators: collaboratorIds,  
            files_folder,
            languages_used,
            visibility,
            tags
        });

        await project.save();

        adminUser.projects.push(project._id);
        await adminUser.save();

        res.status(201).json({ message: 'Project created successfully', project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating project', error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ visibility: { $in: ['Public', 'Restricted'] } })
            .populate('admin', 'username email')
            .populate('collaborators', 'username email');
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('admin', 'username email')
            .populate('collaborators', 'username email');
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching project', error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const project = await Project.findByIdAndUpdate(id, updatedData, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project', error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        await User.findByIdAndUpdate(project.admin, { $pull: { projects: project._id } });

        await project.deleteOne();

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting project', error: error.message });
    }
};



exports.addCollaborator = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        
        const project = await Project.findById(projectId);
        const user = await User.findById(userId);
        if (!project || !user) return res.status(404).json({ message: 'Project or User not found' });

        
        if (!project.collaborators.includes(userId)) {
            project.collaborators.push(userId);
            await project.save();

            
            user.collaborations.push(projectId);
            await user.save();
        }

        res.status(200).json({ message: 'Collaborator added successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error adding collaborator', error: error.message });
    }
};


exports.removeCollaborator = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        const project = await Project.findById(projectId);
        const user = await User.findById(userId);
        if (!project || !user) return res.status(404).json({ message: 'Project or User not found' });

        project.collaborators = project.collaborators.filter(collab => collab.toString() !== userId);
        await project.save();

        user.collaborations = user.collaborations.filter(proj => proj.toString() !== projectId);
        await user.save();

        res.status(200).json({ message: 'Collaborator removed successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error removing collaborator', error: error.message });
    }
};


exports.likeProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Add like if not already liked
        if (!project.likes.includes(userId)) {
            project.likes.push(userId);
            await project.save();
        }

        res.status(200).json({ message: 'Project liked successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error liking project', error: error.message });
    }
};


exports.unlikeProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Remove like if exists
        project.likes = project.likes.filter(like => like.toString() !== userId);
        await project.save();

        res.status(200).json({ message: 'Project unliked successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error unliking project', error: error.message });
    }
};


exports.changeProjectStatus = async (req, res) => {
    try {
        const { projectId, status } = req.body;

        if (!['Active', 'Completed', 'Archived'].includes(status)) {
            return res.status(400).json({ message: 'Invalid project status' });
        }

        const project = await Project.findByIdAndUpdate(projectId, { status }, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        res.status(200).json({ message: 'Project status updated successfully', project });
    } catch (error) {
        res.status(500).json({ message: 'Error updating project status', error: error.message });
    }
};
