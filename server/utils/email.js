const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to, subject, html, text,
        });
        return true;
    } catch (err) {
        console.error('Email send error:', err.message);
        return false;
    }
};

const emailTemplates = {
    welcome: (name) => ({
        subject: 'Welcome to YouTubeLMS!',
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#6366f1;">Welcome, ${name}!</h1><p>Thank you for joining YouTubeLMS. Start exploring courses and advance your skills today!</p><a href="${process.env.CLIENT_URL}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px;">Browse Courses</a></div>`,
    }),

    emailVerification: (name, token) => ({
        subject: 'Verify Your Email - YouTubeLMS',
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#6366f1;">Verify Your Email</h1><p>Hi ${name}, click below to verify your email:</p><a href="${process.env.CLIENT_URL}/verify-email/${token}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px;">Verify Email</a><p style="margin-top:15px;color:#666;">This link expires in 24 hours.</p></div>`,
    }),

    passwordReset: (name, token) => ({
        subject: 'Reset Your Password - YouTubeLMS',
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#6366f1;">Reset Password</h1><p>Hi ${name}, click below to reset your password:</p><a href="${process.env.CLIENT_URL}/reset-password/${token}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px;">Reset Password</a><p style="margin-top:15px;color:#666;">This link expires in 1 hour.</p></div>`,
    }),

    enrollmentConfirmation: (name, courseTitle) => ({
        subject: `Enrollment Confirmed - ${courseTitle}`,
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#6366f1;">You're Enrolled!</h1><p>Hi ${name}, you've been enrolled in <strong>${courseTitle}</strong>. Start learning now!</p><a href="${process.env.CLIENT_URL}/user/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px;">Go to Dashboard</a></div>`,
    }),

    paymentReceipt: (name, invoiceNo, amount, courseTitle) => ({
        subject: `Payment Receipt - ${invoiceNo}`,
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#6366f1;">Payment Receipt</h1><p>Hi ${name},</p><p>Your payment has been confirmed:</p><table style="width:100%;border-collapse:collapse;margin:15px 0;"><tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Invoice</td><td style="padding:8px;text-align:right;font-weight:bold;">${invoiceNo}</td></tr><tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Course</td><td style="padding:8px;text-align:right;">${courseTitle}</td></tr><tr><td style="padding:8px;">Amount</td><td style="padding:8px;text-align:right;font-weight:bold;color:#6366f1;">$${amount}</td></tr></table></div>`,
    }),

    instructorApproved: (name) => ({
        subject: 'Your Instructor Application is Approved!',
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#22c55e;">Congratulations, ${name}!</h1><p>Your instructor application has been approved. You can now create and publish courses on our platform.</p><a href="${process.env.CLIENT_URL}/instructor/dashboard" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:10px;">Start Creating</a></div>`,
    }),

    courseApproved: (name, courseTitle) => ({
        subject: `Course Published - ${courseTitle}`,
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#22c55e;">Course Published!</h1><p>Hi ${name}, your course <strong>${courseTitle}</strong> has been approved and is now live on the platform.</p></div>`,
    }),

    courseRejected: (name, courseTitle) => ({
        subject: `Course Review Update - ${courseTitle}`,
        html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#ef4444;">Course Update Required</h1><p>Hi ${name}, your course <strong>${courseTitle}</strong> requires some changes before it can be published. Please review and resubmit.</p></div>`,
    }),
};

module.exports = { sendEmail, emailTemplates };
