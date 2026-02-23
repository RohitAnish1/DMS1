const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authenticateToken = require('./middleware/auth'); 

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', authenticateToken, require('./routes/appointments'));

app.get('/', (req, res) => {
    res.send('Doctor Management System API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
