const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Prescription = require('../models/prescription.model');
const mongoose = require('mongoose');

function serviceError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function snapshotAddress(address) {
    const fields = [
        'label',
        'fullName',
        'phone',
        'streetAddress',
        'locality',
        'city',
        'state',
        'postalCode',
        'country'
    ];
    const snapshot = Object.fromEntries(
        fields.map((field) => [field, address[field] == null ? '' : String(address[field]).trim()])
    );

    if (
        !snapshot.fullName
        || !/^[0-9]{10}$/.test(snapshot.phone)
        || !snapshot.streetAddress
        || !snapshot.city
        || !snapshot.state
        || !/^[1-9][0-9]{5}$/.test(snapshot.postalCode)
    ) {
        throw serviceError('A valid delivery address is required', 400);
    }

    if (!snapshot.country) snapshot.country = 'India';
    return snapshot;
}

class OrderService {
    async removeOrderedItems(userId, orderedItems) {
        const cart = await Cart.findOne({ userId }).select('_id');
        if (!cart) return;

        for (const item of orderedItems) {
            await Cart.updateOne(
                {
                    _id: cart._id,
                    items: {
                        $elemMatch: {
                            productId: item.productId,
                            quantity: { $gte: item.quantity }
                        }
                    }
                },
                { $inc: { 'items.$.quantity': -item.quantity } }
            );
        }

        await Cart.updateOne(
            { _id: cart._id },
            { $pull: { items: { quantity: { $lte: 0 } } } }
        );
    }

    async getCheckoutAddress(userId, addressId, enteredAddress) {
        if (enteredAddress) {
            return snapshotAddress(enteredAddress);
        }

        if (!addressId || !mongoose.isValidObjectId(addressId)) {
            throw serviceError('Select a valid delivery address', 400);
        }

        const user = await User.findById(userId).select('addresses');
        const address = user?.addresses.id(addressId);
        if (!address) {
            throw serviceError('Delivery address not found', 404);
        }

        return snapshotAddress(address);
    }

    async placeOrder(userId, options = {}) {
        const paymentMethod = options.paymentMethod || 'COD';
        if (paymentMethod !== 'COD') {
            throw serviceError('Only Cash on Delivery is currently supported', 400);
        }

        const requestedKey = typeof options.idempotencyKey === 'string'
            ? options.idempotencyKey.trim()
            : '';
        if (requestedKey) {
            if (requestedKey.length > 128) {
                throw serviceError('Invalid checkout idempotency key', 400);
            }
            const existingOrder = await Order.findOne({
                userId,
                checkoutKey: requestedKey
            });
            if (existingOrder) {
                await this.removeOrderedItems(userId, existingOrder.items);
                return existingOrder;
            }
        }

        const address = await this.getCheckoutAddress(
            userId,
            options.addressId,
            options.deliveryAddress
        );

        let cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            throw serviceError('Your cart is empty', 400);
        }

        const checkoutKey = requestedKey || `${cart._id}:${cart.updatedAt.getTime()}`;
        if (!checkoutKey || checkoutKey.length > 128) {
            throw serviceError('Invalid checkout idempotency key', 400);
        }

        const existingOrder = await Order.findOne({ userId, checkoutKey });
        if (existingOrder) {
            await this.removeOrderedItems(userId, existingOrder.items);
            return existingOrder;
        }
        if (cart.items.length === 0) {
            throw serviceError('Your cart is empty', 400);
        }

        const orderItems = [];
        const prescriptionProductIds = cart.items
            .filter((item) => item.productId?.requiresPrescription)
            .map((item) => item.productId._id);
        const approvedPrescriptionProductIds = await Prescription.find({
            userId,
            productId: { $in: prescriptionProductIds },
            status: 'Approved'
        }).distinct('productId');
        const approvedPrescriptionSet = new Set(
            approvedPrescriptionProductIds.map((id) => id.toString())
        );

        for (const item of cart.items) {
            const product = item.productId;
            if (!product || !product.isActive) {
                throw serviceError('A product is no longer available', 409);
            }
            if (product.requiresPrescription) {
                if (!approvedPrescriptionSet.has(product._id.toString())) {
                    throw serviceError(
                        `An approved prescription is required for ${product.name}`,
                        403
                    );
                }
            }
            if (product.stock < item.quantity) {
                throw serviceError(`Insufficient stock for ${product.name}`, 409);
            }

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: product.price * item.quantity
            });
        }

        const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const decrementedItems = [];

        let order;
        try {
            for (const item of orderItems) {
                const result = await Product.updateOne(
                    {
                        _id: item.productId,
                        isActive: true,
                        stock: { $gte: item.quantity }
                    },
                    { $inc: { stock: -item.quantity } }
                );

                if (result.modifiedCount !== 1) {
                    throw serviceError('Stock changed. Please review your cart and try again', 409);
                }
                decrementedItems.push(item);
            }

            order = await Order.create({
                userId,
                checkoutKey,
                items: orderItems,
                subtotal,
                totalAmount: subtotal,
                deliveryAddress: address,
                paymentMethod: 'COD',
                paymentStatus: 'Pending',
                status: 'Order Placed'
            });

        } catch (error) {
            const rollbackResults = await Promise.all(
                decrementedItems.map((item) => Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: item.quantity } }
                ))
            );
            if (rollbackResults.some((result) => result.modifiedCount !== 1)) {
                console.error('Checkout stock rollback was incomplete');
                throw serviceError('Checkout could not complete; inventory recovery is required', 500);
            }

            if (error.code === 11000) {
                const duplicateOrder = await Order.findOne({ userId, checkoutKey });
                if (duplicateOrder) {
                    await this.removeOrderedItems(userId, duplicateOrder.items);
                    return duplicateOrder;
                }
            }
            throw error;
        }

        await this.removeOrderedItems(userId, order.items);
        return order;
    }

    async getMyOrders(userId) {
        return Order.find({ userId }).sort({ createdAt: -1 });
    }

    async getAllOrders() {
        return Order.find().sort({ createdAt: -1 });
    }

    async getOrderById(requester, orderId) {
        if (!mongoose.isValidObjectId(orderId)) {
            throw serviceError('Invalid order ID', 400);
        }

        const filter = { _id: orderId };
        if (requester.role !== 'admin') {
            filter.userId = requester.id;
        }
        return Order.findOne(filter);
    }

    async restoreCancelledOrder(order) {
        if (order.stockRestored) return order;

        for (const item of order.items) {
            const restored = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    stockRestoredOrderIds: { $ne: order._id }
                },
                {
                    $inc: { stock: item.quantity },
                    $addToSet: { stockRestoredOrderIds: order._id }
                },
                { new: false }
            );

            if (!restored) {
                const productExists = await Product.exists({ _id: item.productId });
                const alreadyRestored = await Product.exists({
                    _id: item.productId,
                    stockRestoredOrderIds: order._id
                });
                if (!productExists || !alreadyRestored) {
                    console.error('Order stock restoration could not be completed');
                    throw serviceError('Order cancellation requires inventory recovery', 500);
                }
            }
        }

        await Order.updateOne(
            { _id: order._id, status: 'Cancelled' },
            { $set: { stockRestored: true } }
        );
        return Order.findById(order._id);
    }

    async cancelOrder(requester, orderId) {
        if (!mongoose.isValidObjectId(orderId)) {
            throw serviceError('Invalid order ID', 400);
        }

        const filter = { _id: orderId };
        if (requester.role !== 'admin') {
            filter.userId = requester.id;
        }

        const order = await Order.findOne(filter);
        if (!order) return null;
        if (order.status === 'Delivered') {
            throw serviceError('Delivered orders cannot be cancelled', 409);
        }

        if (order.status !== 'Cancelled') {
            await Order.updateOne(
                { _id: order._id, status: { $ne: 'Cancelled' } },
                { $set: { status: 'Cancelled', cancelledAt: new Date() } }
            );
        }

        const cancelledOrder = await Order.findById(order._id);
        return this.restoreCancelledOrder(cancelledOrder);
    }

    async updateStatus(orderId, status) {
        const allowedStatuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
        if (!allowedStatuses.includes(status)) {
            throw serviceError('Invalid order status', 400);
        }
        if (!mongoose.isValidObjectId(orderId)) {
            throw serviceError('Invalid order ID', 400);
        }

        return Order.findOneAndUpdate(
            { _id: orderId, status: { $nin: ['Cancelled', 'Delivered'] } },
            { $set: { status } },
            { new: true, runValidators: true }
        );
    }

    async recoverCancelledOrders() {
        const orders = await Order.find({
            status: 'Cancelled',
            stockRestored: false,
            checkoutKey: { $exists: true },
            deliveryAddress: { $exists: true }
        });
        for (const order of orders) {
            await this.restoreCancelledOrder(order);
        }
    }
}

module.exports = new OrderService();
