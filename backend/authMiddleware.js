const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']; // client sends: Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // split "Bearer <token>"
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // save user info into request
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
