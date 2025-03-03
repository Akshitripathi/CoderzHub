const Chat = require('../models/chat');

exports.getChats = async (req, res) => {
    try {
        const { projectId } = req.params;
        const chats = await Chat.find({ projectId }).populate('userId', 'username');
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error: error.message });
    }
};

exports.addChat = async (req, res) => {
    try {
        const { projectId, userId, message } = req.body;
        console.log('Received chat message:', { projectId, userId, message }); // Add logging
        const chat = new Chat({ projectId, userId, message });
        await chat.save();
        res.status(201).json({ message: 'Chat added successfully', chat });
    } catch (error) {
        console.error('Error adding chat:', error); // Add logging
        res.status(500).json({ message: 'Error adding chat', error: error.message });
    }
};