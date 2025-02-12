const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "akshi1233.be22@chitkara.edu.in", 
        pass: "Sparks@14209AkshiManiT"  
    }
});

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long', success: false });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists', success: false });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            verificationToken
        });

        await newUser.save();

        console.log(`Verification token: ${verificationToken}`);

        return res.status(201).json({ message: 'User registered successfully. Please verify your email.', success: true });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

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
            { expiresIn: "1h" }
        );
        
        const mailOptions = {
            from: "akshi1233.be22@chitkara.edu.in",
            to: user.email,
            subject: "Welcome to Our Platform!",
            text: `Hello ${user.username},\n\nWelcome to our platform! We're excited to have you on board.\n\nBest Regards,\nYour Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Greeting email sent:", info.response);
            }
        });

        res.status(200).json({ success: true, token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getProfile = async (req, res) => {
    try {
        console.log("User requesting profile:", req.user); 

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized - No user found" });
        }

        res.json({ success: true, user: req.user });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



// const verifyEmail = async (req, res) => {
//     const { token } = req.params;
//     try {
//         const user = await User.findOne({ verificationToken: token });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired verification token', success: false });
//         }

//         user.isVerified = true;
//         user.verificationToken = null;
//         await user.save();

//         return res.status(200).json({ message: 'Email verified successfully', success: true });
//     } catch (error) {
//         return res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found', success: false });
        }

        
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
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

module.exports = { register, login, getProfile, requestPasswordReset, resetPassword };
