const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Prescription = require('../models/prescription.model');

const PRESCRIPTION_DIRECTORY = path.resolve(__dirname, '..', 'private-prescriptions');
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function serviceError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function detectPrescriptionFile(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw serviceError('Choose a prescription file to upload');
    }
    if (buffer.length > MAX_FILE_SIZE) {
        throw serviceError('Prescription files must be 5 MB or smaller', 413);
    }

    if (buffer.subarray(0, 5).toString('ascii') === '%PDF-') {
        return { fileExtension: 'pdf', mimeType: 'application/pdf' };
    }
    if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        return { fileExtension: 'png', mimeType: 'image/png' };
    }
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return { fileExtension: 'jpg', mimeType: 'image/jpeg' };
    }

    throw serviceError('Upload a valid PDF, JPEG, or PNG prescription');
}

class PrescriptionService {
    async upload(userId, productId, buffer) {
        if (!mongoose.isValidObjectId(productId)) {
            throw serviceError('Invalid product ID');
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
            requiresPrescription: true
        }).select('_id');
        if (!product) {
            throw serviceError('Prescription upload is only available for active prescription-required products', 404);
        }

        const file = detectPrescriptionFile(buffer);
        const pending = await Prescription.exists({
            userId,
            productId,
            status: 'Pending'
        });
        if (pending) {
            throw serviceError('A prescription for this product is already awaiting review', 409);
        }

        const storageName = `${crypto.randomUUID()}.${file.fileExtension}`;
        await fs.mkdir(PRESCRIPTION_DIRECTORY, { recursive: true, mode: 0o700 });
        const filePath = path.join(PRESCRIPTION_DIRECTORY, storageName);
        await fs.writeFile(filePath, buffer, { flag: 'wx', mode: 0o600 });

        try {
            const prescription = await Prescription.create({
                userId,
                productId,
                storageName,
                ...file
            });
            return prescription;
        } catch (error) {
            try {
                await fs.unlink(filePath);
            } catch (cleanupError) {
                if (cleanupError.code !== 'ENOENT') {
                    console.error('Prescription upload file cleanup failed');
                    throw serviceError('Prescription upload could not be completed; file cleanup is required', 500);
                }
            }
            if (error.code === 11000) {
                throw serviceError('A prescription for this product is already awaiting review', 409);
            }
            throw error;
        }
    }

    async getMine(userId) {
        return Prescription.find({ userId })
            .select('-storageName')
            .populate('productId', 'name')
            .sort({ createdAt: -1 });
    }

    async getPendingForReview() {
        return Prescription.find({ status: 'Pending' })
            .select('-storageName')
            .populate('userId', 'name email')
            .populate('productId', 'name')
            .sort({ createdAt: 1 });
    }

    async review(prescriptionId, reviewerId, status, reviewNote = '') {
        if (!mongoose.isValidObjectId(prescriptionId)) {
            throw serviceError('Invalid prescription ID');
        }
        if (!['Approved', 'Rejected'].includes(status)) {
            throw serviceError('Review status must be Approved or Rejected');
        }
        if (typeof reviewNote !== 'string' || reviewNote.length > 500) {
            throw serviceError('Review note must be 500 characters or fewer');
        }

        const prescription = await Prescription.findOneAndUpdate(
            { _id: prescriptionId, status: 'Pending' },
            {
                $set: {
                    status,
                    reviewedBy: reviewerId,
                    reviewNote: reviewNote.trim(),
                    reviewedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        )
            .select('-storageName')
            .populate('userId', 'name email')
            .populate('productId', 'name');

        if (!prescription) {
            throw serviceError('Prescription not found or already reviewed', 404);
        }
        return prescription;
    }

    async getFile(requester, prescriptionId) {
        if (!mongoose.isValidObjectId(prescriptionId)) {
            throw serviceError('Invalid prescription ID');
        }

        const filter = { _id: prescriptionId };
        if (requester.role !== 'admin') {
            filter.userId = requester.id;
        }
        const prescription = await Prescription.findOne(filter).select('+storageName');
        if (!prescription) {
            throw serviceError('Prescription not found', 404);
        }

        const filePath = path.resolve(PRESCRIPTION_DIRECTORY, prescription.storageName);
        if (
            path.dirname(filePath) !== PRESCRIPTION_DIRECTORY
            || path.basename(prescription.storageName) !== prescription.storageName
        ) {
            throw serviceError('Prescription file is unavailable', 404);
        }

        try {
            await fs.access(filePath);
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw serviceError('Prescription file is unavailable', 404);
            }
            throw error;
        }

        return {
            filePath,
            fileExtension: prescription.fileExtension
        };
    }
}

module.exports = new PrescriptionService();
module.exports.detectPrescriptionFile = detectPrescriptionFile;
