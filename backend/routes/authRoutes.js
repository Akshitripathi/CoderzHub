const express = require('express');
const { register, login, getProfile, requestPasswordReset, resetPassword, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getprofile', authMiddleware, getProfile);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/updateprofile',authMiddleware,updateProfile)

module.exports = router;
