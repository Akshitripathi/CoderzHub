const express = require('express');
const router = express.Router();
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

module.exports = router;
