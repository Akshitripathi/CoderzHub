import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ projectId, username, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chats/${projectId}`);
                console.log('Fetched messages:', response.data); // Debugging
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        fetchMessages();
    }, [projectId]);
    

    const handleSendMessage = async () => {
        if (!username) {
            console.error('Username is missing');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/chats/add', { 
                projectId, 
                username, 
                message: newMessage 
            });
    
            console.log('Sent message:', response.data.chat);
            setMessages([...messages, response.data.chat]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <span>Project Chat</span>
                <button onClick={onClose}>X</button>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id} className="chat-message">
                        <strong>{msg.username}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;