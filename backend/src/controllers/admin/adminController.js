const Admin = require('../../models/Admin');

// Get current admin profile
exports.getProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        res.json({
            success: true,
            data: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                isActive: admin.isActive,
                lastLogin: admin.lastLogin,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update admin profile (email and name)
exports.updateProfile = async (req, res) => {
    try {
        const { email, name } = req.body;
        const adminId = req.admin.id;

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== admin.email) {
            const existingAdmin = await Admin.findOne({ email });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }
            admin.email = email;
        }

        if (name) {
            admin.name = name;
        }

        await admin.save();

        res.json({
            success: true,
            data: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const adminId = req.admin.id;

        console.log('Change password attempt for admin:', adminId);

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both current and new password'
            });
        }

        const admin = await Admin.findById(adminId).select('+password');

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        console.log('Admin found for password change:', {
            email: admin.email,
            hasPassword: !!admin.password,
            passwordLength: admin.password ? admin.password.length : 0,
            currentPasswordLength: currentPassword.length,
            newPasswordLength: newPassword.length
        });

        // Verify current password
        const isPasswordValid = await admin.comparePassword(currentPassword);

        console.log('Current password verification:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Current password is incorrect' });
        }

        console.log('Setting new password...');

        // Update to new password (will be hashed by pre-save hook)
        admin.password = newPassword;
        await admin.save();

        console.log('Password changed successfully for:', admin.email);

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reset password (for super admin to reset other admin passwords)
exports.resetPassword = async (req, res) => {
    try {
        const { adminId, newPassword } = req.body;

        if (req.admin.role !== 'super_admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password is required'
            });
        }

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        admin.password = newPassword;
        await admin.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
