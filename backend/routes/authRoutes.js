const express = require('express');
const { register, login, getProfile, requestPasswordReset, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getprofile', authMiddleware, getProfile);
// router.get('/verify-email/:token', verifyEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
