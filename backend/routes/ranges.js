const express = require('express');
const router = express.Router();
const rangeController = require('../controllers/rangeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, rangeController.createRange);
router.get('/', rangeController.getRanges);

module.exports = router;
