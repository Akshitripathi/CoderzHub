const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS 
    }
});


const register = async (req, res) => {
    const { name,username, email, password, phone_no, profile_picture, bio, github_link, linkedin_link } = req.body;

    try {
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', success: false });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone_no }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or Phone Number already in use', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            phone_no,
            profile_picture,
            bio,
            social_profiles: [github_link, linkedin_link],
            verificationToken
        });

        await newUser.save();

        console.log(`Verification token: ${verificationToken}`);


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to CoderzHub",
            text: `Hello, \n\nWelcome to CoderzHub! We're excited to have you on board. If you need any help, feel free to reach out.\n\nBest regards,\nThe CoderzHub Team`
        };
        
       
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) console.error("Error sending verification email:", err);
            else console.log("Verification email sent:", info.response);
        });

        return res.status(201).json({ message: 'User registered successfully. Please verify your email.', success: true });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        res.status(200).json({ success: true, token, userId: user._id, message: "Login successful" }); 
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token', success: false });
        }

        user.verificationToken = null;
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();

        console.log(`Password reset token: ${resetToken}`);

        return res.status(200).json({ message: 'Password reset token generated', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token', success: false });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({ message: 'Password reset successful', success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { name, email, phone_no, bio, github_link, linkedin_link, profile_picture } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone_no = phone_no || user.phone_no;
        user.bio = bio || user.bio;
        user.profile_picture = profile_picture || user.profile_picture;

        user.github_link = github_link || user.github_link;
        user.linkedin_link = linkedin_link || user.linkedin_link;

        let updatedSocialProfiles = new Set(user.social_profiles); 

        if (github_link) updatedSocialProfiles.add(github_link);
        if (linkedin_link) updatedSocialProfiles.add(linkedin_link);

        user.social_profiles = Array.from(updatedSocialProfiles); 

        await user.save();

        res.json({
            success: true,
            message: "Profile updated successfully!",
            user: {
                name: user.name,
                email: user.email,
                phone_no: user.phone_no,
                bio: user.bio,
                profile_picture: user.profile_picture,
                github_link: user.github_link,
                linkedin_link: user.linkedin_link,
                social_profiles: user.social_profiles, 
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
};



module.exports = {updateProfile, register, login, getProfile, verifyEmail, requestPasswordReset, resetPassword };
