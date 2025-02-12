const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectWithDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();


app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 

connectWithDb();

app.use('/api/auth', authRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
