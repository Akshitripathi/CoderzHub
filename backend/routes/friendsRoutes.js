const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Project = require("../models/project");
const authenticateUser = require("../middleware/authMiddleware"); // Ensure authentication


router.get("/", authenticateUser, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find all projects where the user is the owner
        const projects = await Project.find({ owner: userId }).populate("collaborators");

        // Extract unique collaborator IDs
        const collaboratorIds = new Set();
        projects.forEach((project) => {
            project.collaborators.forEach((collaborator) => {
                if (collaborator._id.toString() !== userId) {
                    collaboratorIds.add(collaborator._id.toString());
                }
            });
        });

        // Fetch details of collaborators
        const friends = await User.find({ _id: { $in: Array.from(collaboratorIds) } })
            .select("username name status profile_picture"); // Selecting required fields

        res.json({ success: true, friends });
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ success: false, message: "Error fetching friends list" });
    }
});

module.exports = router;
