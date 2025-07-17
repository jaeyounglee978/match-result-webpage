const express = require('express');
const router = express.Router();
const shooterController = require('../controllers/shooterController');
const authMiddleware = require('../middleware/authMiddleware');

// All shooter routes require authentication
router.get('/:shooterName/profile', authMiddleware, shooterController.getShooterProfile);
router.get('/:shooterName/matches', authMiddleware, shooterController.getShooterMatches);
router.get('/:shooterName/statistics', authMiddleware, shooterController.getShooterStatistics);

module.exports = router;