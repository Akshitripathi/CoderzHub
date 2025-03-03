const express = require('express');
const multer = require('multer');
const Project = require('../models/project');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'projects/' });

const projectController = require('../controllers/projectController');

router.post('/create-project', projectController.createProject);
router.get('/get-all-project', projectController.getProjects);
router.get('/get-project/:id', projectController.getProjectById);
router.put('/update-project/:id', projectController.updateProject);
router.delete('/delete-project/:id', projectController.deleteProject);
router.post('/add-collaborator-project', projectController.addCollaborator);
router.post('/remove-collaborator-project', projectController.removeCollaborator);
router.post('/like-project', projectController.likeProject);
router.post('/unlike-project', projectController.unlikeProject);
router.post('/change-status-project', projectController.changeProjectStatus);
router.get('/get-project-files/:projectId', projectController.getProjectFiles);
router.post('/:projectId/save-file', projectController.saveFileContent); // Correct route

// Upload file and add reference to project
router.post('/:projectId/upload', upload.single('file'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const fileReference = {
      filename: req.file.originalname,
      filepath: path.join('projects', req.file.filename)
    };

    project.files.push(fileReference);
    await project.save();

    res.send(fileReference);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get files for a project
router.get('/:projectId/files', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    res.send({ files: project.files });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete file
router.delete('/:projectId/files/:filename', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const fileIndex = project.files.findIndex(file => file.filename === req.params.filename);
    if (fileIndex === -1) {
      return res.status(404).send('File not found');
    }

    const filePath = path.join(__dirname, '..', project.files[fileIndex].filepath);
    fs.unlinkSync(filePath);

    project.files.splice(fileIndex, 1);
    await project.save();

    res.send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Rename file
router.put('/:projectId/files/:filename', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    const fileIndex = project.files.findIndex(file => file.filename === req.params.filename);
    if (fileIndex === -1) {
      return res.status(404).send('File not found');
    }

    const oldFilePath = path.join(__dirname, '..', project.files[fileIndex].filepath);
    const newFilePath = path.join('projects', req.body.newFilename);

    fs.renameSync(oldFilePath, path.join(__dirname, '..', newFilePath));

    project.files[fileIndex].filename = req.body.newFilename;
    project.files[fileIndex].filepath = newFilePath;
    await project.save();

    res.send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
