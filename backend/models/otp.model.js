const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            index: true
        },
        otpHash: {
            type: String,
            required: true,
            select: false
        },
        attempts: {
            type: Number,
            default: 0,
            min: 0
        },
        used: {
            type: Boolean,
            default: false,
            index: true
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Otp', otpSchema);
