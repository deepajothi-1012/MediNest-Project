const prescriptionService = require('../services/prescription.service');

function handleError(res, error) {
    const status = error.statusCode
        || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
    return res.status(status).json({
        message: status >= 500 ? 'Request could not be completed' : error.message
    });
}

class PrescriptionController {
    async upload(req, res) {
        try {
            const prescription = await prescriptionService.upload(
                req.user.id,
                req.params.productId,
                req.body
            );
            return res.status(201).json({
                message: 'Prescription submitted for review',
                prescription
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getMine(req, res) {
        try {
            const prescriptions = await prescriptionService.getMine(req.user.id);
            return res.status(200).json({ prescriptions });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getPendingForReview(req, res) {
        try {
            const prescriptions = await prescriptionService.getPendingForReview();
            return res.status(200).json({ prescriptions });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async review(req, res) {
        try {
            const prescription = await prescriptionService.review(
                req.params.id,
                req.user.id,
                req.body?.status,
                req.body?.reviewNote || ''
            );
            return res.status(200).json({
                message: 'Prescription review saved',
                prescription
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async downloadMine(req, res) {
        try {
            const file = await prescriptionService.getFile(req.user, req.params.id);
            return res.download(file.filePath, `prescription.${file.fileExtension}`);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async downloadForReview(req, res) {
        try {
            const file = await prescriptionService.getFile(
                { ...req.user, role: 'admin' },
                req.params.id
            );
            return res.download(file.filePath, `prescription.${file.fileExtension}`);
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new PrescriptionController();
