import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getChats } from '../api'; // Assuming you have an API function to fetch chat history
import '../styles/ChatWindow.css';

const socket = io('http://localhost:5000'); // Backend URL

const ChatWindow = ({ projectId, username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Join the project room
        socket.emit('joinRoom', projectId);

        // Fetch chat history
        const fetchChats = async () => {
            try {
                const response = await getChats(projectId);
                setMessages(response);
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };

        fetchChats();

        // Listen for new messages
        const handleReceiveMessage = (data) => {
            setMessages((prevMessages) => {
                // Avoid adding duplicate messages
                if (!prevMessages.some((msg) => msg._id === data._id)) {
                    return [...prevMessages, data];
                }
                return prevMessages;
            });
        };

        socket.on('receiveMessage', handleReceiveMessage);

        // Cleanup on component unmount
        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
        };
    }, [projectId]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        const newMessage = {
            _id: Date.now(), // Temporary ID for local state
            projectId,
            username,
            message,
            timestamp: new Date(),
        };

        // Emit the message to the server
        socket.emit('sendMessage', newMessage);

        // Add the message to the local state
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Clear the input field
        setMessage('');
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h3>Live Chat</h3>
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.username}:</strong> {msg.message}
                        <span className="timestamp">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;