const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, adminMiddleware, userController.getUsers);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.put('/:id/role', authMiddleware, adminMiddleware, userController.updateUserRole);

module.exports = router;
