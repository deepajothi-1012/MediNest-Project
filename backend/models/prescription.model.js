const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            index: true
        },
        storageName: {
            type: String,
            required: true,
            select: false
        },
        fileExtension: {
            type: String,
            enum: ['pdf', 'jpg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'avif', 'heic', 'heif'],
            required: true
        },
        mimeType: {
            type: String,
            enum: [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/bmp',
                'image/tiff',
                'image/avif',
                'image/heic',
                'image/heif'
            ],
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
            index: true
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewNote: {
            type: String,
            maxlength: 500,
            trim: true
        },
        reviewedAt: Date
    },
    { timestamps: true }
);

prescriptionSchema.index(
    { userId: 1, productId: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'Pending' }
    }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
