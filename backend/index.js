const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticateToken = require('./middleware/auth'); // Import the new middleware

const app = express();

// Middleware
app.use(cors({
    origin: '*', // For now, allow all, but you can set this to your Vercel URL later
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', authenticateToken, require('./routes/appointments')); // Apply middleware here

// Health check
app.get('/', (req, res) => {
    res.send('Doctor Management System API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
