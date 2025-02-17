const express = require('express');
const {addProject, getProject, updateProject , deleteProject} = require('../controllers/projectController');
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add-project', addProject);
router.post('/get-project', getProject);
router.get('/update-project', updateProject);
router.post('/delete-project', deleteProject);

module.exports = router;
