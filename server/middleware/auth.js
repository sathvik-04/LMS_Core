const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
        if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
        if (user.status === 'inactive') return res.status(403).json({ success: false, message: 'Account is deactivated.' });

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid token.' });
    }
};

// Optional auth — sets req.user if token exists, but doesn't fail
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }
    } catch (err) { /* ignore */ }
    next();
};

// Role-based authorization
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated.' });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this action.' });
        }
        next();
    };
};

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

module.exports = { auth, optionalAuth, authorize, generateToken };
