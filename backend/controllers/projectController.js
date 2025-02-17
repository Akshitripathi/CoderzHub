const Project= require('../models/project');

const addProject = async (req, res) => {
    const { project_name, project_collaborators, project_tech_stack_used, project_admin} = req.body;

    try {
        if (project_name.length < 4) {
            return res.status(400).json({ message: 'Project name should be atleast of 4 letter' });
        }

        const existingProject = await Project.findOne({ $or: [{ project_name }] });
        if (existingProject) {
            return res.status(400).json({ message: 'Project name already in use!! Take something else..' });
        }

        
        const newProject = new Project({
            project_name,
            project_collaborators,
            project_files,
            project_status,
            project_last_seen,
            project_createdAt,
            project_updatedAt,
            project_tech_stack_used,
            project_admin,
        });

        await newProject.save();

        return res.status(201).json({ message: 'Project registered successfully.' });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getProject = async (req, res) => {
    
    try{
        const { id} = req.params;
        if(id){
            const project= await Project.findById(id).populate('project_collaborators','name email').populate('project_files').populate('project_admin','name email');
            if(!project){
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.status(200).json(project);
        }else{
            const projects= await Project.find().populate('project_collaborators','name email').populate('project_files').populate('project_admin','name email')
            return res.status(200).json(projects);
        }
        
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteProject = async (req, res) => {
    
    try{
        const { id} = req.params;
        if(id){
            const project= await Project.findById(id).populate('project_collaborators','name email').populate('project_files').populate('project_admin','name email');
            if(!project){
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.status(200).json(project);
        }else{
            const projects= await Project.find().populate('project_collaborators','name email').populate('project_files').populate('project_admin','name email')
            return res.status(200).json(projects);
        }
        
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateProject = async (req, res) => {
    
    try{
        const { id} = req.params;
        if(id){
            const project= await Project.findById(id).populate('project_collaborators','name email').populate('project_files').populate('project_admin','name email');
            if(!project){
                return res.status(404).json({ message: 'Project not found' });
            }
            return res.status(200).json(project);
        }else{
            const projects= await Project.find().populate('project_collaborators','name email').populate('project_files').populate('project_admin','name email')
            return res.status(200).json(projects);
        }
        
    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports(addProject, getProject, updateProject , deleteProject)