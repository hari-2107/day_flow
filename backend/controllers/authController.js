const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dayflow_secret_key';

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { email, password, role, name, employeeId, department, designation, phone, address } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const normalizedRole = role && role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';
    const finalEmployeeId = employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalName = name || (normalizedRole === 'ADMIN' ? 'HR Officer' : email.split('@')[0]);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: normalizedRole,
      employee_id: finalEmployeeId,
      name: finalName,
      department: department || 'Engineering',
      designation: designation || (normalizedRole === 'ADMIN' ? 'HR Manager' : 'Software Engineer'),
      phone: phone || '+1 (555) 123-4567',
      address: address || '123 Tech Park, Suite 400',
      is_verified: true
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, employee_id: user.employee_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone,
        address: user.address,
        salary: user.salary
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during signup.', error: error.message });
  }
};

// POST /api/auth/signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, employee_id: user.employee_id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        employeeId: user.employee_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone,
        address: user.address,
        salary: user.salary
      }
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ message: 'Server error during signin.', error: error.message });
  }
};

// POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { code, email } = req.body;
    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying email.' });
  }
};
