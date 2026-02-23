const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const SubCategory = require('./models/SubCategory');
const SiteInfo = require('./models/SiteInfo');
const InfoBox = require('./models/InfoBox');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Create admin user
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User', firstName: 'Admin', lastName: 'User',
                email: 'admin@youtubelms.com', password: 'admin123',
                role: 'admin', status: 'active', isEmailVerified: true,
            });
            console.log('✅ Admin user created (admin@youtubelms.com / admin123)');
        }

        // Create sample instructor
        const instructorExists = await User.findOne({ role: 'instructor' });
        if (!instructorExists) {
            await User.create({
                name: 'John Instructor', firstName: 'John', lastName: 'Instructor',
                email: 'instructor@youtubelms.com', password: 'instructor123',
                role: 'instructor', status: 'active', isEmailVerified: true,
                bio: 'Experienced software development instructor with 10+ years of teaching experience.',
                expertise: 'Web Development, JavaScript, React',
            });
            console.log('✅ Instructor user created (instructor@youtubelms.com / instructor123)');
        }

        // Create sample student
        const studentExists = await User.findOne({ role: 'user' });
        if (!studentExists) {
            await User.create({
                name: 'Jane Student', firstName: 'Jane', lastName: 'Student',
                email: 'student@youtubelms.com', password: 'student123',
                role: 'user', status: 'active', isEmailVerified: true,
            });
            console.log('✅ Student user created (student@youtubelms.com / student123)');
        }

        // Create categories
        const catCount = await Category.countDocuments();
        if (catCount === 0) {
            const categories = [
                { name: 'Web Development', slug: 'web-development', icon: '💻', description: 'Learn modern web development technologies' },
                { name: 'Mobile Development', slug: 'mobile-development', icon: '📱', description: 'Build mobile apps for iOS and Android' },
                { name: 'Data Science', slug: 'data-science', icon: '📊', description: 'Master data analysis and machine learning' },
                { name: 'Design', slug: 'design', icon: '🎨', description: 'UI/UX design and graphic design courses' },
                { name: 'Business', slug: 'business', icon: '💼', description: 'Business strategy and entrepreneurship' },
                { name: 'Marketing', slug: 'marketing', icon: '📣', description: 'Digital marketing and SEO' },
            ];
            const created = await Category.insertMany(categories);
            console.log('✅ Categories created');

            // Create subcategories
            const webDev = created.find(c => c.slug === 'web-development');
            const mobile = created.find(c => c.slug === 'mobile-development');
            const dataSci = created.find(c => c.slug === 'data-science');

            await SubCategory.insertMany([
                { name: 'JavaScript', slug: 'javascript', category: webDev._id },
                { name: 'React', slug: 'react', category: webDev._id },
                { name: 'Node.js', slug: 'nodejs', category: webDev._id },
                { name: 'Python', slug: 'python', category: webDev._id },
                { name: 'React Native', slug: 'react-native', category: mobile._id },
                { name: 'Flutter', slug: 'flutter', category: mobile._id },
                { name: 'Machine Learning', slug: 'machine-learning', category: dataSci._id },
                { name: 'Deep Learning', slug: 'deep-learning', category: dataSci._id },
            ]);
            console.log('✅ Subcategories created');
        }

        // Create site info
        const siteInfoExists = await SiteInfo.findOne();
        if (!siteInfoExists) {
            await SiteInfo.create({
                siteName: 'YouTubeLMS', metaTitle: 'YouTubeLMS - Learn Without Limits',
                metaDescription: 'A premium online learning platform powered by YouTube content.',
                copyright: `© ${new Date().getFullYear()} YouTubeLMS. All rights reserved.`,
                email: 'contact@youtubelms.com', phone: '+1 234 567 890',
            });
            console.log('✅ Site info created');
        }

        // Create info boxes
        const infoBoxCount = await InfoBox.countDocuments();
        if (infoBoxCount === 0) {
            await InfoBox.insertMany([
                { title: '10,000+ Courses', description: 'Explore a vast library of courses across all categories.', icon: '📚', order: 0 },
                { title: 'Expert Instructors', description: 'Learn from industry professionals and top educators.', icon: '👨‍🏫', order: 1 },
                { title: 'Lifetime Access', description: 'Once enrolled, access your courses forever.', icon: '♾️', order: 2 },
                { title: 'Certificates', description: 'Earn certificates upon course completion.', icon: '🏆', order: 3 },
            ]);
            console.log('✅ Info boxes created');
        }

        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
