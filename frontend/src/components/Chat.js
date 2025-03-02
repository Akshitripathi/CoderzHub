import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Chat = ({ projectId, userId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chats/${projectId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [projectId]);

    const handleSendMessage = async () => {
        try {
            const response = await axios.post('/api/chats', { projectId, userId, message: newMessage });
            setMessages([...messages, response.data.chat]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg._id}>
                        <strong>{msg.userId.username}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;