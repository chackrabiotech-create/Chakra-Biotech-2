/**
 * Change Admin Password Script
 * 
 * This script allows you to change the admin password directly in the database.
 * Useful when you're locked out or forgot your password.
 * 
 * Usage: 
 *   node scripts/changeAdminPassword.js
 * 
 * Or with command line arguments:
 *   node scripts/changeAdminPassword.js admin@chakrabiotech.com newPassword123
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const Admin = require('../src/models/Admin');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify readline question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function changeAdminPassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chakra-bio', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('\n' + '='.repeat(60));
        console.log('         ADMIN PASSWORD CHANGE UTILITY');
        console.log('='.repeat(60) + '\n');

        // Get email from command line args or prompt
        let email = process.argv[2];
        if (!email) {
            email = await question('Enter admin email: ');
        }

        // Validate email
        if (!email || !email.includes('@')) {
            console.error('❌ Invalid email address');
            process.exit(1);
        }

        // Find admin
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

        if (!admin) {
            console.error(`❌ Admin not found with email: ${email}`);
            console.log('\nAvailable admins:');
            const allAdmins = await Admin.find({}, 'email name role');
            if (allAdmins.length === 0) {
                console.log('   No admins found in database.');
                console.log('   Run: node scripts/seedDatabase.js to create an admin account.');
            } else {
                allAdmins.forEach(a => {
                    console.log(`   - ${a.email} (${a.name}, ${a.role})`);
                });
            }
            process.exit(1);
        }

        console.log(`\n✓ Admin found: ${admin.email}`);
        console.log(`  Name: ${admin.name}`);
        console.log(`  Role: ${admin.role}`);
        console.log(`  Status: ${admin.isActive ? 'Active' : 'Inactive'}\n`);

        // Get new password from command line args or prompt
        let newPassword = process.argv[3];
        if (!newPassword) {
            newPassword = await question('Enter new password (min 6 characters): ');
        }

        // Validate password
        if (!newPassword || newPassword.length < 6) {
            console.error('❌ Password must be at least 6 characters long');
            process.exit(1);
        }

        // Confirm password change
        let confirm = 'y';
        if (!process.argv[3]) { // Only ask for confirmation if not using command line args
            confirm = await question(`\nAre you sure you want to change the password for ${email}? (y/n): `);
        }

        if (confirm.toLowerCase() !== 'y') {
            console.log('❌ Password change cancelled');
            process.exit(0);
        }

        // Change password (will be hashed by the pre-save hook in the Admin model)
        admin.password = newPassword;
        await admin.save();

        console.log('\n' + '='.repeat(60));
        console.log('✓ PASSWORD CHANGED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`\n📧 Email: ${admin.email}`);
        console.log(`🔑 New Password: ${newPassword}`);
        console.log('\n⚠️  IMPORTANT: Store this password securely!');
        console.log('   You can now login to the admin panel with these credentials.\n');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ Error changing password:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        rl.close();
        await mongoose.connection.close();
        console.log('Database connection closed.\n');
        process.exit(0);
    }
}

// Run the script
changeAdminPassword();
