/**
 * Reset Admin Password Script
 * 
 * This script allows you to reset the admin password directly in the database.
 * Use this if you're locked out or the password got corrupted.
 * 
 * Usage: node scripts/resetAdminPassword.js
 */

const mongoose = require('mongoose');
const readline = require('readline');
require('dotenv').config();

const Admin = require('../src/models/Admin');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function resetPassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chakra-bio', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB\n');
        console.log('='.repeat(50));
        console.log('         ADMIN PASSWORD RESET');
        console.log('='.repeat(50));

        // Get admin email
        const email = await question('\nEnter admin email: ');

        // Find admin
        const admin = await Admin.findOne({ email: email.trim() });

        if (!admin) {
            console.log('\n❌ Admin not found with email:', email);
            console.log('Available admins:');
            const allAdmins = await Admin.find({}, 'email name');
            allAdmins.forEach(a => console.log(`  - ${a.email} (${a.name})`));
            process.exit(1);
        }

        console.log('\n✓ Admin found:', admin.email);
        console.log('  Name:', admin.name);
        console.log('  Role:', admin.role);

        // Get new password
        const newPassword = await question('\nEnter new password: ');

        if (!newPassword || newPassword.trim().length === 0) {
            console.log('\n❌ Password cannot be empty!');
            process.exit(1);
        }

        // Update password
        console.log('\nUpdating password...');
        admin.password = newPassword.trim();
        await admin.save();

        console.log('\n' + '='.repeat(50));
        console.log('✓ Password reset successfully!');
        console.log('='.repeat(50));
        console.log('\nYou can now login with:');
        console.log('  Email:', admin.email);
        console.log('  Password:', newPassword.trim());
        console.log('\n' + '='.repeat(50) + '\n');

    } catch (error) {
        console.error('\n❌ Error resetting password:', error);
        process.exit(1);
    } finally {
        rl.close();
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
}

// Run the script
resetPassword();
