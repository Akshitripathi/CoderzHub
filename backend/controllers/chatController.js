const Chat = require('../models/Chat');

exports.getChats = async (req, res) => {
    try {
        const { projectId } = req.params;
        const chats = await Chat.find({ projectId });
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error });
    }
};

exports.addChat = async (req, res) => {
    try {
        const { projectId, username, message } = req.body;
        const newChat = new Chat({ projectId, username, message });
        const savedChat = await newChat.save();
        res.status(201).json({ chat: savedChat });
    } catch (error) {
        res.status(500).json({ message: 'Error adding chat', error });
    }
};