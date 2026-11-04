  
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = authMiddleware.adminMiddleware;

router.post('/signup', userController.userSignup);

router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);

router.post('/forgot-password', userController.forgotPassword);

router.post('/verify-otp', userController.verifyOTP);

router.post('/reset-password', userController.resetPassword);

router.get('/me', authMiddleware, userController.getUserProfile);
router.patch('/me', authMiddleware, userController.updateUserProfile);
router.get('/me/addresses', authMiddleware, userController.getAddresses);
router.post('/me/addresses', authMiddleware, userController.saveAddress);
router.put('/me/addresses/:addressId', authMiddleware, userController.updateAddress);
router.delete('/me/addresses/:addressId', authMiddleware, userController.deleteAddress);

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);

router.get('/:id', authMiddleware, userController.getUserById);

module.exports = router;
