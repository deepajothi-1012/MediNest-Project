const jwt = require('jsonwebtoken');

function getSecretKey() {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return process.env.JWT_SECRET;
}

class TokenService {

    generateToken(payload) {
        return jwt.sign(payload, getSecretKey(), {
            expiresIn: '1h',
            issuer: 'medinest'
        });
    }

    verifyToken(token) {
        return jwt.verify(token, getSecretKey(), {
            issuer: 'medinest'
        });
    }
}

module.exports = new TokenService();