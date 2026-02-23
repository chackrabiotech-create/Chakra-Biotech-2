const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { JWT_EXPIRES_IN } = require('../config/constants');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt:', { email, providedPassword: password ? '***' : 'missing' });

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find admin with password field included
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      console.log('Login failed: Admin not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      console.log('Login failed: Admin account is disabled');
      return res.status(401).json({ success: false, message: 'Account is disabled' });
    }

    console.log('Admin found:', {
      email: admin.email,
      hasPassword: !!admin.password,
      passwordLength: admin.password ? admin.password.length : 0,
      passwordStartsWith: admin.password ? admin.password.substring(0, 7) : 'N/A'
    });

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);

    console.log('Password comparison result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login - DON'T trigger save hook for password
    await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('Login successful for:', email);

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin not found or inactive' });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
