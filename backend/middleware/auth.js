const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
           
            console.error('JWT verification error:', err);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; 
        next(); 
    });
}

module.exports = authenticateToken;
