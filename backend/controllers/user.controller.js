const userService = require('../services/user.service');

function handleError(res, error) {
    const status = error.statusCode
        || (error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500);
    return res.status(status).json({
        message: status >= 500 ? 'Request could not be completed' : error.message
    });
}

class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({ users });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getUserById(req, res) {
        try {
            if (req.params.id !== String(req.user.id) && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }

            const user = await userService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getUserProfile(req, res) {
        try {
            const user = await userService.getUserProfile(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async updateUserProfile(req, res) {
        try {
            const user = await userService.updateUserProfile(req.user.id, req.body || {});
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getAddresses(req, res) {
        try {
            const addresses = await userService.getAddresses(req.user.id);
            if (!addresses) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ addresses });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async saveAddress(req, res) {
        try {
            const addresses = await userService.saveAddress(req.user.id, req.body || {});
            if (!addresses) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(201).json({ message: 'Address saved successfully', addresses });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async updateAddress(req, res) {
        try {
            const addresses = await userService.updateAddress(
                req.user.id,
                req.params.addressId,
                req.body || {}
            );
            if (!addresses) {
                return res.status(404).json({ message: 'Address not found' });
            }
            return res.status(200).json({ message: 'Address updated successfully', addresses });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async deleteAddress(req, res) {
        try {
            const addresses = await userService.deleteAddress(
                req.user.id,
                req.params.addressId
            );
            if (!addresses) {
                return res.status(404).json({ message: 'Address not found' });
            }
            return res.status(200).json({ message: 'Address deleted successfully', addresses });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async userSignup(req, res) {
        try {
            const { name, email, password } = req.body || {};
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email and password are required' });
            }

            const user = await userService.userSignup({ name, email, password });
            return res.status(201).json({
                message: 'User registered successfully',
                user
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ message: 'A user with this email already exists' });
            }
            return handleError(res, error);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body || {};
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const data = await userService.loginUser(email, password);
            return res.status(200).json({ message: 'Login successful', data });
        } catch (error) {
            if (error.statusCode === 401) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            return handleError(res, error);
        }
    }

    async logout(req, res) {
        try {
            await userService.logoutUser(req.user.id);
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async forgotPassword(req, res) {
        try {
            const result = await userService.requestPasswordReset(req.body?.email);
            return res.status(200).json(result);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async verifyOTP(req, res) {
        try {
            const result = await userService.verifyOTP(
                req.body?.email,
                req.body?.otp
            );
            return res.status(200).json(result);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async resetPassword(req, res) {
        try {
            const { email, otp, newPassword, confirmPassword } = req.body || {};
            if (!email || !otp || !newPassword || !confirmPassword) {
                return res.status(400).json({ message: 'All fields are required' });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }

            const result = await userService.resetPassword({ email, otp, newPassword });
            return res.status(200).json(result);
        } catch (error) {
            return handleError(res, error);
        }
    }
}

module.exports = new UserController();
