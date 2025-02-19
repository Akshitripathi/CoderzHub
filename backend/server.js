const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectWithDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const friendsRoutes= require('./routes//friendsRoutes.js');

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 

connectWithDb();

app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/friends', friendsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
