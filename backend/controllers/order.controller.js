const orderService = require('../services/order.service');

function handleError(res, error) {
    const status = error.statusCode
        || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
    return res.status(status).json({
        message: status >= 500 ? 'Request could not be completed' : error.message
    });
}

class OrderController {
    async placeOrder(req, res) {
        try {
            const options = {
                ...(req.body || {}),
                idempotencyKey: req.get('Idempotency-Key') || req.body?.idempotencyKey
            };
            const order = await orderService.placeOrder(req.user.id, options);
            return res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                orderId: order._id,
                paymentMethod: order.paymentMethod,
                paymentStatus: order.paymentStatus,
                order
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getMyOrders(req, res) {
        try {
            const orders = await orderService.getMyOrders(req.user.id);
            return res.status(200).json({ orders });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getAllOrders(req, res) {
        try {
            const orders = await orderService.getAllOrders();
            return res.status(200).json({ orders });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await orderService.getOrderById(req.user, req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.status(200).json({ order });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async cancelOrder(req, res) {
        try {
            const order = await orderService.cancelOrder(req.user, req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.status(200).json({ message: 'Order cancelled successfully', order });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async updateStatus(req, res) {
        try {
            const order = await orderService.updateStatus(req.params.id, req.body?.status);
            if (!order) {
                return res.status(404).json({ message: 'Order not found or status cannot be changed' });
            }
            return res.status(200).json({ message: 'Order status updated successfully', order });
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new OrderController();
