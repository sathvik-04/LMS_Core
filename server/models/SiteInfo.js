const mongoose = require('mongoose');

const siteInfoSchema = new mongoose.Schema({
    siteName: { type: String, default: 'YouTubeLMS' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    copyright: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    commissionRate: { type: Number, default: 30 },
    // SMTP settings
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    // Stripe settings
    stripePublishableKey: { type: String, default: '' },
    stripeSecretKey: { type: String, default: '' },
    // Google OAuth settings
    googleClientId: { type: String, default: '' },
    googleClientSecret: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('SiteInfo', siteInfoSchema);
