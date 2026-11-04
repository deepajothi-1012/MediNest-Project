const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, cartController.getCart);

router.post('/add', authMiddleware, cartController.addToCart);

router.put('/update/:productId', authMiddleware, cartController.updateQuantity);

router.delete('/remove/:productId', authMiddleware, cartController.removeFromCart);

module.exports = router;