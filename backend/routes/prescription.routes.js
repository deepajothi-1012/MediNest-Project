const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescription.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = authMiddleware.adminMiddleware;

router.get('/mine', authMiddleware, prescriptionController.getMine);
router.get('/mine/:id/file', authMiddleware, prescriptionController.downloadMine);
router.post(
    '/:productId',
    authMiddleware,
    express.raw({ type: 'application/octet-stream', limit: '5mb' }),
    prescriptionController.upload
);
router.get('/admin', authMiddleware, adminMiddleware, prescriptionController.getPendingForReview);
router.get('/admin/:id/file', authMiddleware, adminMiddleware, prescriptionController.downloadForReview);
router.patch('/admin/:id', authMiddleware, adminMiddleware, prescriptionController.review);

module.exports = router;
