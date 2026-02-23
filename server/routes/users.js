const router = require('express').Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Update profile
router.put('/profile', auth, upload.single('photo'), async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) updates.photo = `/uploads/avatars/${req.file.filename}`;
        if (updates.socialLinks && typeof updates.socialLinks === 'string') {
            updates.socialLinks = JSON.parse(updates.socialLinks);
        }
        delete updates.password;
        delete updates.role;
        delete updates.email;

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get user profile (public)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name photo bio expertise role socialLinks');
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
