const Chat = require('../models/chat');

exports.getChats = async (req, res) => {
    try {
        const { projectId } = req.params;
        const chats = await Chat.find({ projectId });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error: error.message });
    }
};

exports.addChat = async (req, res) => {
    try {
        const { projectId, username, message } = req.body;
        console.log('Received chat message:', { projectId, username, message });
        const chat = new Chat({ projectId, username, message });
        await chat.save();
        res.status(201).json({ message: 'Chat added successfully', chat });
    } catch (error) {
        console.error('Error adding chat:', error);
        res.status(500).json({ message: 'Error adding chat', error: error.message });
    }
};