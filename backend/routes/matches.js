const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('pscfile'), matchController.uploadMatch);
router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatchById);
router.delete('/:id', authMiddleware, adminMiddleware, matchController.deleteMatch);

module.exports = router;
