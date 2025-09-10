const express = require('express');
const { getAllClaims, approveClaim, rejectClaim } = require('../controllers/claimController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All claim routes should be protected and only accessible by authenticated users.
// Further checks inside the controller will restrict actions to admins.
router.use(authMiddleware);

// GET /api/claims - Fetches all claims
router.get('/', getAllClaims);

// POST /api/claims/:claimId/approve - Approves a specific claim
router.post('/:claimId/approve', approveClaim);

// POST /api/claims/:claimId/reject - Rejects a specific claim
router.post('/:claimId/reject', rejectClaim);

module.exports = router;
