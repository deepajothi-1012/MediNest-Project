
const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

const adminMiddleware = authMiddleware.adminMiddleware;

router.get('/admin/inventory', authMiddleware, adminMiddleware, productController.getInventory);
router.get('/', productController.getAllProducts);
router.post('/', authMiddleware, adminMiddleware, productController.addProduct);
router.post('/add', authMiddleware, adminMiddleware, productController.addProduct);
router.put('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.patch('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deactivateProduct);
router.get('/:id', productController.getProductById);

module.exports = router;
