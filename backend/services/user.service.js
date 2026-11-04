
const mongoose = require('mongoose');
const User = require('../models/user.model');
const UserProfile = require('../models/user.profile');
const bcrypt = require('bcryptjs');
const tokenService = require('../jwt/token.service');
const emailService = require('../email/email.service');

const addressFields = [
    'label',
    'fullName',
    'phone',
    'streetAddress',
    'locality',
    'city',
    'state',
    'postalCode',
    'country',
    'isDefault'
];

function pickAddressFields(data) {
    return Object.fromEntries(
        Object.entries(data).filter(([field]) => addressFields.includes(field))
    );
}

function serviceError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

class UserService {

    async getAllUsers() {
        return await User.find({ isActive: true }).select('-password');
    }

    
async getUserById(id) {
    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    const userData = await User.findById(id).select('-password');

    if (!userData) {
        return null;
    }

    const profileData = await UserProfile.findOne({ user: id });

    return { userData, profileData };
}

async getUserProfile(userId) {
    if (!mongoose.isValidObjectId(userId)) {
        return null;
    }

    const userData = await User.findById(userId).select('-password');

    if (!userData) {
        return null;
    }

    const profileData = await UserProfile.findOne({ user: userId });

    return { userData, profileData };
}

async updateUserProfile(userId, profileData) {
    if (!mongoose.isValidObjectId(userId)) {
        return null;
    }

    const updates = {};
    if (profileData.name !== undefined) {
        if (typeof profileData.name !== 'string' || !profileData.name.trim()) {
            throw serviceError('Name must not be empty');
        }
        updates.name = profileData.name.trim();
    }

    if (Object.keys(updates).length === 0) {
        throw serviceError('Name is required');
    }

    return User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true
    }).select('-password');
}

async getAddresses(userId) {
    const user = await User.findById(userId).select('addresses');
    return user ? user.addresses : null;
}

async saveAddress(userId, addressData) {
    const user = await User.findById(userId);
    if (!user) return null;

    const address = pickAddressFields(addressData);
    if (address.isDefault !== undefined && typeof address.isDefault !== 'boolean') {
        throw serviceError('isDefault must be a boolean');
    }
    if (address.isDefault || !user.addresses.some((item) => item.isDefault)) {
        user.addresses.forEach((item) => { item.isDefault = false; });
        address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();
    return user.addresses;
}

async updateAddress(userId, addressId, addressData) {
    const user = await User.findById(userId);
    if (!user) return null;

    const address = user.addresses.id(addressId);
    if (!address) return null;

    const updates = pickAddressFields(addressData);
    if (Object.keys(updates).length === 0) {
        throw serviceError('At least one valid address field is required');
    }
    if (updates.isDefault !== undefined && typeof updates.isDefault !== 'boolean') {
        throw serviceError('isDefault must be a boolean');
    }

    if (updates.isDefault === true) {
        user.addresses.forEach((item) => { item.isDefault = false; });
    }
    Object.assign(address, updates);
    if (!user.addresses.some((item) => item.isDefault)) {
        user.addresses[0].isDefault = true;
    }
    await user.save();
    return user.addresses;
}

async deleteAddress(userId, addressId) {
    const user = await User.findById(userId);
    if (!user) return null;

    const address = user.addresses.id(addressId);
    if (!address) return null;

    const wasDefault = address.isDefault;
    user.addresses.pull(addressId);
    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }
    await user.save();
    return user.addresses;
}


    async userSignup({ name, email, password }) {
        if (
            typeof name !== 'string'
            || !name.trim()
            || typeof email !== 'string'
            || !email.trim()
            || typeof password !== 'string'
            || !password
        ) {
            throw serviceError('Name, email and password are required');
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            throw serviceError('Enter a valid email address');
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            throw serviceError('User with this email already exists', 409);
        }

        if (typeof password !== 'string' || password.length < 8) {
            throw serviceError('Password must be at least 8 characters long');
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        const userData = user.toObject();
        delete userData.password;

        return userData;
    }

    async loginUser(email, password) {
        if (typeof email !== 'string' || typeof password !== 'string') {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail,
            isActive: true
        }).select('+password +tokenVersion');

        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion,
            isActive: user.isActive
        };

        const token = tokenService.generateToken(payload);

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        delete userWithoutPassword.tokenVersion;

        return {
            user: userWithoutPassword,
            token
        };
    }

    async logoutUser(userId) {
        return User.updateOne(
            { _id: userId, isActive: true },
            { $inc: { tokenVersion: 1 } }
        );
    }

    async addUserProfile(userId, profileData) {
        if (!mongoose.isValidObjectId(userId)) {
            throw new Error('Invalid user ID');
        }

        const existingProfile = await UserProfile.findOne({
            user: userId
        });

        if (existingProfile) {
            throw new Error('Profile already exists');
        }

        return await UserProfile.create({
            user: userId,
            age: profileData.age,
            dob: profileData.dob,
            bio: profileData.bio
        });
    }


    async requestPasswordReset(email) {
        return await emailService.requestPasswordReset(email);
    }

    async verifyOTP(email, otp) {
        return await emailService.verifyOTP({
            email,
            otp
        });
    }

    async resetPassword({ email, otp, newPassword }) {
        return await emailService.resetPassword({
            email,
            otp,
            newPassword
        });
    }
}

module.exports = new UserService();
