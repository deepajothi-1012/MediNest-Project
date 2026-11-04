const mongoose = require('mongoose');

const orderAddressSchema = new mongoose.Schema(
    {
        label: String,
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        streetAddress: { type: String, required: true },
        locality: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'India' }
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        checkoutKey: {
            type: String,
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                name: { type: String, required: true },
                price: { type: Number, required: true, min: 0 },
                quantity: { type: Number, required: true, min: 1 },
                subtotal: { type: Number, required: true, min: 0 }
            }
        ],
        subtotal: { type: Number, required: true, min: 0 },
        totalAmount: { type: Number, required: true, min: 0 },
        deliveryAddress: {
            type: orderAddressSchema,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ['COD'],
            default: 'COD',
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
            default: 'Pending'
        },
        status: {
            type: String,
            enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Order Placed'
        },
        stockRestored: {
            type: Boolean,
            default: false
        },
        cancelledAt: Date
    },
    { timestamps: true }
);

orderSchema.index({ userId: 1, checkoutKey: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);
