const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = authMiddleware.adminMiddleware;

router.post('/place', authMiddleware, orderController.placeOrder);
router.get('/my-orders', authMiddleware, orderController.getMyOrders);
router.get('/admin', authMiddleware, adminMiddleware, orderController.getAllOrders);
router.patch('/admin/:id/status', authMiddleware, adminMiddleware, orderController.updateStatus);
router.post('/:id/cancel', authMiddleware, orderController.cancelOrder);
router.get('/:id', authMiddleware, orderController.getOrderById);

module.exports = router;