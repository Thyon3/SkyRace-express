const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect);
router.use(admin);


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
