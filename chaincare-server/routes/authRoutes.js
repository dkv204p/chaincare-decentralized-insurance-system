const express = require('express');
// Make sure to import getAllUsers
const { register, login, getMe, getAllUsers } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', authMiddleware, getMe);

// GET /api/auth/users - This is the new route
router.get('/users', authMiddleware, getAllUsers);

module.exports = router;