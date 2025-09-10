const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { username, password, ethAddress } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { ethAddress }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Ethereum address already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashedPassword, ethAddress });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // IMPORTANT: Send back the user object, including ethAddress
    res.json({ token, user: { id: user._id, username: user.username, ethAddress: user.ethAddress } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

// NEW FUNCTION TO GET ALL USERS
const getAllUsers = async (req, res) => {
  // Security check: Ensure only an admin can access this list
  if (req.user.username !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Access is restricted to administrators.' });
  }
  try {
    // Find all users and exclude the password field
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// EXPORT ALL FUNCTIONS
module.exports = { register, login, getMe, getAllUsers };