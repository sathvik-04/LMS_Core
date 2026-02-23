const router = require('express').Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
        const type = req.query.type || 'images';
        const url = `/uploads/${type}/${req.file.filename}`;
        res.json({ success: true, url, filename: req.file.filename });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
