/**
 * Seed Database with Initial Admin and Company Data
 * 
 * This script creates:
 * 1. Initial admin account from .env or defaults
 * 2. Company details with footer settings
 * 
 * IMPORTANT: 
 * - .env ADMIN_EMAIL and ADMIN_PASSWORD are ONLY used for initial seeding
 * - After seeding, login uses database-saved credentials
 * - Admin can change email/password through the admin panel Settings
 * - Changing .env values after seeding has NO effect on authentication
 * 
 * Usage: node scripts/seedDatabase.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('../src/models/Admin');
const CompanyDetails = require('../src/models/CompanyDetails');

// Default admin credentials (ONLY used for initial seeding, NOT for login)
const defaultAdmin = {
    email: process.env.ADMIN_EMAIL || 'admin@chakrabiotech.com',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    name: 'Super Admin',
    role: 'super_admin'
};

// Default company details
const defaultCompanyDetails = {
    companyName: 'Chakra Biotech',
    email: 'info@chakrabiotech.com',
    phone: '+91 98765 43210',
    alternatePhone: '+91 98765 43211',
    whatsappNumber: '919876543210',

    address: {
        street: 'Innovation Hub, Tech Park',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        zipCode: '302021'
    },

    socialMedia: {
        facebook: 'https://facebook.com/chakrabiotech',
        instagram: 'https://instagram.com/chakrabiotech',
        twitter: 'https://twitter.com/chakrabiotech',
        linkedin: 'https://linkedin.com/company/chakrabiotech',
        youtube: 'https://youtube.com/@chakrabiotech'
    },

    businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
    },

    footer: {
        description: 'An Agri-Tech leader specializing in precision-controlled aeroponic saffron cultivation. We are democratizing "Red Gold" through sustainable technology and innovation.',
        offerings: [
            'Aeroponic Saffron',
            'Indoor Cultivation Training',
            'CEA Consulting',
            'Biotech Innovation',
            'Sustainable Farming'
        ],
        quickLinks: [
            { name: 'Our Products', href: '/products' },
            { name: 'Training Programs', href: '/training' },
            { name: 'Research & Blog', href: '/blog' },
            { name: 'About Company', href: '/about' },
            { name: 'Terms of Service', href: '/terms' }
        ],
        copyrightText: 'Chakra Biotech LLP. All rights reserved.'
    },

    aboutUs: 'Chakra Biotech is pioneering the future of agriculture through innovative aeroponic technology. We specialize in precision-controlled saffron cultivation systems that maximize yield while minimizing environmental impact.',

    mission: 'To democratize premium saffron cultivation and make it accessible to farmers worldwide through sustainable, technology-driven solutions.',

    vision: 'A world where sustainable agriculture meets cutting-edge technology, creating food security and economic opportunity for all.',

    metaTitle: 'Chakra Biotech - Aeroponic Saffron Cultivation Solutions',
    metaDescription: 'Leading provider of precision-controlled aeroponic saffron cultivation systems. Sustainable agriculture technology for premium saffron production.',
    metaKeywords: [
        'aeroponic saffron',
        'saffron cultivation',
        'indoor farming',
        'controlled environment agriculture',
        'biotech',
        'sustainable farming'
    ]
};

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chakra-bio', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB\n');
        console.log('='.repeat(50));
        console.log('         DATABASE SEEDING STARTED');
        console.log('='.repeat(50));

        // 1. Create/Update Admin Account
        console.log('\n1. Setting up Admin Account...');
        let admin = await Admin.findOne({ email: defaultAdmin.email });

        if (admin) {
            console.log(`   ⚠️  Admin already exists: ${admin.email}`);
            console.log('   Skipping admin creation...');
        } else {
            admin = await Admin.create(defaultAdmin);
            console.log(`   ✓ Admin created successfully!`);
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: ${defaultAdmin.password}`);
            console.log(`   Role: ${admin.role}`);
            console.log('\n   ⚠️  IMPORTANT: Change this password after first login!');
        }

        // 2. Create/Update Company Details
        console.log('\n2. Setting up Company Details...');
        let companyDetails = await CompanyDetails.findOne();

        if (companyDetails) {
            console.log('   ⚠️  Company details already exist');
            console.log('   Updating with new data...');
            companyDetails = await CompanyDetails.findByIdAndUpdate(
                companyDetails._id,
                defaultCompanyDetails,
                { new: true, runValidators: true }
            );
            console.log('   ✓ Company details updated successfully!');
        } else {
            companyDetails = await CompanyDetails.create(defaultCompanyDetails);
            console.log('   ✓ Company details created successfully!');
        }

        console.log(`   Company Name: ${companyDetails.companyName}`);
        console.log(`   Email: ${companyDetails.email}`);
        console.log(`   Phone: ${companyDetails.phone}`);
        console.log(`   WhatsApp: ${companyDetails.whatsappNumber}`);
        console.log(`   Address: ${companyDetails.address.city}, ${companyDetails.address.state}`);

        console.log('\n   Footer Settings:');
        console.log(`   - Description: ${companyDetails.footer.description.substring(0, 50)}...`);
        console.log(`   - Offerings: ${companyDetails.footer.offerings.length} items`);
        console.log(`   - Quick Links: ${companyDetails.footer.quickLinks.length} items`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('         SEEDING COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log('\n📋 Summary:');
        console.log('   ✓ Admin account ready');
        console.log('   ✓ Company details configured');
        console.log('   ✓ Footer settings initialized');
        console.log('   ✓ WhatsApp number configured');
        console.log('\n🚀 Next Steps:');
        console.log('   1. Start the backend server: npm run dev');
        console.log('   2. Login to admin panel with:');
        console.log(`      Email: ${defaultAdmin.email}`);
        console.log(`      Password: ${defaultAdmin.password}`);
        console.log('   3. Change admin password in Settings → Security');
        console.log('   4. Change admin email in Settings → Profile');
        console.log('   5. Update company details as needed');
        console.log('\n⚠️  IMPORTANT:');
        console.log('   - Login uses DATABASE credentials, NOT .env values');
        console.log('   - After changing email/password in admin panel,');
        console.log('     use the NEW credentials to login');
        console.log('   - .env values are ONLY for initial seeding');
        console.log('\n' + '='.repeat(50) + '\n');

    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
}

// Run the seeding
seedDatabase();
