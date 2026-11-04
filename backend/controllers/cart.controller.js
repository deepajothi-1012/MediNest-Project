
const cartService = require('../services/cart.service');

class CartController {

    async getCart(req, res) {
        try {
            const cart = await cartService.getCart(req.user.id);

            return res.status(200).json({
                message: 'Cart fetched successfully',
                cart
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }

    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;

            if (!productId) {
                return res.status(400).json({
                    message: 'Product ID is required'
                });
            }

            const cart = await cartService.addToCart(
                req.user.id,
                productId,
                quantity === undefined ? 1 : quantity
            );

            return res.status(200).json({
                message: 'Product added to cart',
                cart
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { quantity } = req.body;

            const cart = await cartService.updateQuantity(
                req.user.id,
                req.params.productId,
                quantity
            );

            return res.status(200).json({
                message: 'Cart quantity updated',
                cart
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }

    async removeFromCart(req, res) {
        try {
            const cart = await cartService.removeFromCart(
                req.user.id,
                req.params.productId
            );

            return res.status(200).json({
                message: 'Product removed from cart',
                cart
            });
        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }
    }
}

module.exports = new CartController();
