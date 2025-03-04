import React, { useState } from 'react';
import './ChatIcon.css'; 
import ChatWindow from './ChatWindow';

const ChatIcon = ({ projectId, username }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChatWindow = () => {
        setIsChatOpen(!isChatOpen);
    };

    return (
        <div>
            <div className="chat-icon" onClick={toggleChatWindow}>
                💬
            </div>
            {isChatOpen && <ChatWindow projectId={projectId} username={username} onClose={toggleChatWindow} />}
        </div>
    );
};

export default ChatIcon;