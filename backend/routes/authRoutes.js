const express = require('express');
const { register, login, getProfile, requestPasswordReset, resetPassword, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/getprofile', authMiddleware, getProfile);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.put('/updateprofile',authMiddleware,updateProfile)
router.get("/get-id", async (req, res) => {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "Username is required" });

    const user = await User.findOne({ username }); // Adjust according to DB schema
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ userId: user._id });
  });
  
module.exports = router;
