const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectWithDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const chatRoutes = require('./routes/chatRoutes');
const fs = require('fs');
const path = require('path');
const http = require('http'); // Required for Socket.IO
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Frontend URL
        methods: ["GET", "POST"],
    },
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectWithDb();

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/chat', chatRoutes); // Updated chat route

const projectsDir = path.join(__dirname, 'projects');
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir);
}

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for new chat messages
    socket.on('sendMessage', (data) => {
        console.log('Message received:', data);

        // Broadcast the message to all connected clients
        io.to(data.projectId).emit('receiveMessage', data);
    });

    // Join a specific project room
    socket.on('joinRoom', (projectId) => {
        socket.join(projectId);
        console.log(`User joined room: ${projectId}`);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});