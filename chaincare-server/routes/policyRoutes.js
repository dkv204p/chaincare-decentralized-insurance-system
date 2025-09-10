const express = require('express');
const { createPolicy, getPolicies } = require('../controllers/policyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createPolicy);
router.get('/', authMiddleware, getPolicies);

module.exports = router;
