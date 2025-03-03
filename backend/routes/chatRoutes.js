const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/:projectId', chatController.getChats);
router.post('/add', chatController.addChat); // Update the route to '/add'

module.exports = router;