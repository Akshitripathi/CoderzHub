const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectWithDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
// const compileRouter = require('./routes/compile');
const chatRoutes = require('./routes/chatRoutes');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectWithDb();

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
// app.use('/api', compileRouter);
app.use('/api/chats',chatRoutes);

const projectsDir = path.join(__dirname, 'projects');
if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});