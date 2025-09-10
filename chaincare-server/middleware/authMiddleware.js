const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database to ensure they still exist
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach the full user object to the request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;