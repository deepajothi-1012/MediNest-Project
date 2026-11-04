
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

async function authMiddleware(req, res, next) {

    const authorization = req.headers.authorization;

    const [scheme, token] = authorization
        ? authorization.split(' ')
        : [];

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Authentication token required'
        });
    }

    if (!process.env.JWT_SECRET) {
        return next(new Error('JWT_SECRET is not configured'));
    }

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired authentication token'
        });
    }

    if (!payload.id) {
        return res.status(401).json({
            message: 'Invalid or expired authentication token'
        });
    }

    try {
        const user = await User.findById(payload.id).select('_id email role isActive +tokenVersion');
        if (!user || !user.isActive || payload.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({
                message: 'Invalid or expired authentication token'
            });
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };
        return next();
    } catch (error) {
        return next(error);
    }
}

function adminMiddleware(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Administrator access required'
        });
    }

    return next();
}

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
