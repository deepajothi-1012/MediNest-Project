
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

class CartService {

    async getCart(userId) {
        let cart = await Cart.findOne({ userId })
            .populate('items.productId');

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: []
            });
        }

        return cart;
    }

    async addToCart(userId, productId, quantity = 1) {
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error('Quantity must be at least 1');
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true
        });

        if (!product) {
            throw new Error('Product not found');
        }

        if (product.stock < quantity) {
            throw new Error('Insufficient stock');
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: []
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (item) {
            if (item.quantity + quantity > product.stock) {
                throw new Error('Insufficient stock');
            }

            item.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                quantity
            });
        }

        await cart.save();

        return await Cart.findOne({ userId })
            .populate('items.productId');
    }

    async updateQuantity(userId, productId, quantity) {
        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error('Invalid quantity');
        }

        const product = await Product.findById(productId);

        if (!product || !product.isActive) {
            throw new Error('Product not found');
        }

        if (quantity > product.stock) {
            throw new Error('Insufficient stock');
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw new Error('Cart not found');
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            throw new Error('Product not found in cart');
        }

        item.quantity = quantity;

        await cart.save();

        return await Cart.findOne({ userId })
            .populate('items.productId');
    }

    async removeFromCart(userId, productId) {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        await cart.save();

        return await Cart.findOne({ userId })
            .populate('items.productId');
    }

    async clearCart(userId) {
        return await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } },
            { new: true }
        );
    }
}

module.exports = new CartService();
