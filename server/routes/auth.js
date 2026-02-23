const router = require('express').Router();
const crypto = require('crypto');
const User = require('../models/User');
const { auth, generateToken } = require('../middleware/auth');
const { sendEmail, emailTemplates } = require('../utils/email');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required.' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

        const userRole = (role === 'instructor') ? 'instructor' : 'user';
        const status = (userRole === 'instructor') ? 'pending' : 'active';

        // Email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            name, email, password, role: userRole, status,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' '),
            emailVerificationToken: verificationToken,
            emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        // Send verification email
        const template = emailTemplates.emailVerification(name, verificationToken);
        sendEmail({ to: email, ...template });

        // Send welcome email
        const welcome = emailTemplates.welcome(name);
        sendEmail({ to: email, ...welcome });

        const token = generateToken(user);
        res.status(201).json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        if (user.status === 'inactive') return res.status(403).json({ success: false, message: 'Account is deactivated.' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

        const token = generateToken(user);
        res.json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            emailVerificationToken: req.params.token,
            emailVerificationExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ success: false, message: 'No account with that email.' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        const template = emailTemplates.passwordReset(user.name, resetToken);
        await sendEmail({ to: user.email, ...template });

        res.json({ success: true, message: 'Password reset link sent to your email.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get current user
router.get('/me', auth, async (req, res) => {
    res.json({ success: true, user: req.user });
});

// Change password
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Google OAuth (simplified — client sends the Google token, server verifies)
router.post('/google', async (req, res) => {
    try {
        const { email, name, googleId, photo } = req.body;
        if (!email || !googleId) return res.status(400).json({ success: false, message: 'Google auth data required.' });

        let user = await User.findOne({ email });
        if (user) {
            if (!user.googleId) { user.googleId = googleId; await user.save(); }
        } else {
            user = await User.create({
                name, email, googleId, photo,
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' '),
                isEmailVerified: true,
                password: crypto.randomBytes(16).toString('hex'),
            });
        }

        const token = generateToken(user);
        res.json({ success: true, token, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
