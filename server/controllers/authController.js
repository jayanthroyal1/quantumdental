import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const register = async (req, res) => {
    const { name, email, password, role, adminSecret } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let userRole = 'user';
        if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
            userRole = 'admin';
        } else if (role === 'admin') {
            // Prevent setting admin role without secret via normal payload
            return res.status(400).json({ message: 'Invalid Admin Secret' });
        }

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log(`[Login Attempt] Email: ${email}`); // Log attempt

        // 1. Validate Input
        if (!email || !password) {
            console.log('[Login Error] Missing credentials');
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

        // 2. Find User
        const user = await User.findOne({ email });
        if (!user) {
            console.log('[Login Error] User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Check for Google-only users
        if (!user.password && user.googleId) {
            console.log('[Login Error] Google account user tried password login');
            return res.status(400).json({ message: 'Please login with Google' });
        }

        // 4. Verify Password
        if (!user.password) {
            console.log('[Login Error] User has no password set (and no Google ID known?)');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('[Login Error] Password mismatch');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 5. Success
        console.log(`[Login Success] User: ${user._id}`);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error('[Login Critical Error]:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const googleAuth = async (req, res) => {
    const { credential } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // If user exists but doesn't have googleId (was created via email/pass), we can link it
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                googleId: sub,
                role: 'user', // Default to user
                // password is intentionally undefined
            });
            await user.save();
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(400).json({ message: 'Google authentication failed', error: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and save to DB
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire time (10 minutes)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Create Reset URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please go to this link to reset your password:</p>
            <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            <p>This link expires in 10 minutes.</p>
        `;

        try {
            // Configure Transporter
            // NOTE: In production, store user/pass in .env
            const transporter = nodemailer.createTransport({
                service: process.env.EMAIL_SERVICE || 'gmail',
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // If credentials are provided, send email
            if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || 'noreply@quantumdental.com',
                    to: user.email,
                    subject: 'Password Reset Request',
                    html: message,
                });
                res.json({ success: true, message: 'Email sent successfully' });
            } else {
                // FALLBACK: Log to console for development
                console.log('------------------------------------------');
                console.log('Can not send email (missing credentials).');
                console.log(`Reset Token: ${resetToken}`);
                console.log(`Reset URL: ${resetUrl}`);
                console.log('------------------------------------------');
                res.status(200).json({ success: true, message: 'Email sent (Check Server Console)' });
            }

        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Email could not be sent', error: emailError.message });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or Expired Token' });
        }

        // Update Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear Reset Token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ success: true, message: 'Password Updated Successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
