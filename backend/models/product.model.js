
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        brand: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        oldPrice: {
            type: Number,
            default: 0,
            min: 0
        },
        stock: {
            type: Number,
            default: 0,
            min: 0
        },
        requiresPrescription: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        stockRestoredOrderIds: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            }],
            default: [],
            select: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
