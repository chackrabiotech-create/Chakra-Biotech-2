/**
 * Initialize Footer Settings Script
 * 
 * This script initializes default footer settings in the database.
 * Run this once to set up initial footer data.
 * 
 * Usage: node scripts/initFooterSettings.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const CompanyDetails = require('../src/models/CompanyDetails');

const defaultFooterData = {
    companyName: 'Chakra Biotech',
    email: 'info@chakrabiotech.com',
    phone: '+91 98765 43210',
    whatsappNumber: '919876543210',

    address: {
        street: 'Innovation Hub',
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

    aboutUs: 'Chakra Biotech is pioneering the future of agriculture through innovative aeroponic technology.',
    mission: 'To democratize premium saffron cultivation and make it accessible to everyone.',
    vision: 'A world where sustainable agriculture meets cutting-edge technology.'
};

async function initializeFooterSettings() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chakra-bio', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Check if company details already exist
        let companyDetails = await CompanyDetails.findOne();

        if (companyDetails) {
            console.log('Company details already exist. Updating footer settings...');
            companyDetails = await CompanyDetails.findByIdAndUpdate(
                companyDetails._id,
                { footer: defaultFooterData.footer },
                { new: true, runValidators: true }
            );
            console.log('Footer settings updated successfully!');
        } else {
            console.log('Creating new company details with footer settings...');
            companyDetails = await CompanyDetails.create(defaultFooterData);
            console.log('Company details and footer settings created successfully!');
        }

        console.log('\nFooter Settings:');
        console.log('Description:', companyDetails.footer.description);
        console.log('Offerings:', companyDetails.footer.offerings);
        console.log('Quick Links:', companyDetails.footer.quickLinks);
        console.log('Copyright:', companyDetails.footer.copyrightText);

        console.log('\n✓ Initialization complete!');

    } catch (error) {
        console.error('Error initializing footer settings:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
        process.exit(0);
    }
}

// Run the initialization
initializeFooterSettings();
