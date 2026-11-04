const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const { randomInt } = require('node:crypto');
const User = require('../models/user.model');
const Otp = require('../models/otp.model');
const { getPasswordResetTemplate } = require('./templates/passwordReset.template');

const GENERIC_RESET_RESPONSE = {
    success: true,
    message: 'If an account exists for this email, a password reset code will be sent.'
};
const OTP_LIFETIME_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

class EmailService {
    generateOtp() {
        return randomInt(100000, 1000000).toString();
    }

    async sendMail({ to, subject, text }) {
        const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
        const emailPass = (process.env.SMTP_PASS || process.env.EMAIL_PASS)?.replace(/\s/g, '');

        if (!emailUser || !emailPass) {
            throw new Error('SMTP_USER and SMTP_PASS (or EMAIL_USER and EMAIL_PASS) must be configured');
        }

        const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
        const smtpPort = Number(process.env.SMTP_PORT || 587);
        if (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535) {
            throw new Error('SMTP_PORT must be a valid port number');
        }

        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: process.env.SMTP_SECURE === undefined
                ? smtpPort === 465
                : process.env.SMTP_SECURE.toLowerCase() === 'true',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        });

        return transporter.sendMail({
            from: process.env.MAIL_FROM || emailUser,
            to,
            subject,
            text
        });
    }

    async requestPasswordReset(email) {
        if (typeof email !== 'string' || !email.trim()) {
            const error = new Error('Email is required');
            error.statusCode = 400;
            throw error;
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail, isActive: true });

        if (!user) {
            console.info('Password reset request received; no active account matched.');
            return GENERIC_RESET_RESPONSE;
        }

        const mostRecentOtp = await Otp.findOne({
            email: normalizedEmail,
            used: false,
            expiresAt: { $gt: new Date() },
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
        }).sort({ createdAt: -1 });

        if (mostRecentOtp) {
            console.info('Password reset email not resent; resend cooldown is active.');
            return GENERIC_RESET_RESPONSE;
        }

        await Otp.updateMany(
            { email: normalizedEmail, used: false },
            { $set: { used: true } }
        );

        const otp = this.generateOtp();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpRecord = await Otp.create({
            email: normalizedEmail,
            otpHash,
            expiresAt: new Date(Date.now() + OTP_LIFETIME_MS)
        });

        const template = getPasswordResetTemplate({
            otp,
            name: user.name
        });

        try {
            await this.sendMail({
                to: normalizedEmail,
                subject: template.subject,
                text: template.text
            });
            console.info('Password reset email sent successfully.');
        } catch (error) {
            await Otp.updateOne({ _id: otpRecord._id }, { $set: { used: true } });
            console.error('Password reset email delivery failed:', error.code || 'SMTP_ERROR', error.message);
            const deliveryError = new Error(
                'Unable to send the reset code email. Check the email configuration and try again.'
            );
            deliveryError.statusCode = 503;
            throw deliveryError;
        }

        return GENERIC_RESET_RESPONSE;
    }

    async findMatchingOtp(email, otp) {
        const normalizedEmail = email.trim().toLowerCase();
        const otpRecord = await Otp.findOne({
            email: normalizedEmail,
            used: false,
            expiresAt: { $gt: new Date() },
            attempts: { $lt: MAX_OTP_ATTEMPTS }
        })
            .select('+otpHash')
            .sort({ createdAt: -1 });

        if (!otpRecord) {
            const error = new Error('Invalid or expired OTP');
            error.statusCode = 400;
            throw error;
        }

        if (!(await bcrypt.compare(String(otp).trim(), otpRecord.otpHash))) {
            const failedAttempt = await Otp.findOneAndUpdate(
                {
                    _id: otpRecord._id,
                    used: false,
                    expiresAt: { $gt: new Date() },
                    attempts: { $lt: MAX_OTP_ATTEMPTS }
                },
                { $inc: { attempts: 1 } },
                { new: true }
            );

            if (failedAttempt?.attempts >= MAX_OTP_ATTEMPTS) {
                await Otp.updateOne({ _id: failedAttempt._id }, { $set: { used: true } });
            }

            const error = new Error('Invalid or expired OTP');
            error.statusCode = 400;
            throw error;
        }

        return otpRecord;
    }

    async verifyOTP({ email, otp }) {
        if (typeof email !== 'string' || !email.trim() || !otp) {
            const error = new Error('Email and OTP are required');
            error.statusCode = 400;
            throw error;
        }

        const otpRecord = await this.findMatchingOtp(email, otp);
        return {
            success: true,
            message: 'OTP verified successfully',
            email: otpRecord.email
        };
    }

    async resetPassword({ email, otp, newPassword }) {
        if (typeof email !== 'string' || !email.trim() || !otp || !newPassword) {
            const error = new Error('Email, OTP and new password are required');
            error.statusCode = 400;
            throw error;
        }

        if (typeof newPassword !== 'string' || newPassword.length < 8) {
            const error = new Error('Password must be at least 8 characters long');
            error.statusCode = 400;
            throw error;
        }

        const otpRecord = await this.findMatchingOtp(email, otp);
        const normalizedEmail = email.trim().toLowerCase();
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const consumedOtp = await Otp.updateOne(
            {
                _id: otpRecord._id,
                used: false,
                expiresAt: { $gt: new Date() }
            },
            { $set: { used: true } }
        );

        if (consumedOtp.modifiedCount !== 1) {
            const error = new Error('Invalid or expired OTP');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOneAndUpdate(
            { email: normalizedEmail, isActive: true },
            {
                $set: { password: hashedPassword },
                $inc: { tokenVersion: 1 }
            },
            { new: true }
        ).select('-password');

        if (!user) {
            const error = new Error('Unable to reset password');
            error.statusCode = 400;
            throw error;
        }

        return {
            success: true,
            message: 'Password has been reset successfully.'
        };
    }
}

module.exports = new EmailService();
