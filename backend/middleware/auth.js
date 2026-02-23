const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Use the same secret as in auth.js

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid or expired
            console.error('JWT verification error:', err);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // Attach the decoded user payload to the request object
        next(); // Pass the request to the next middleware/route handler
    });
}

module.exports = authenticateToken;
