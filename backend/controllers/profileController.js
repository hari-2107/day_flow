const User = require('../models/User');

// GET /api/profile/me
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.status(200).json({
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
        photo: user.photo,
        salary: user.salary
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile.', error: error.message });
  }
};

// PATCH /api/profile/me
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { phone, address, photo } = req.body;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (photo !== undefined) user.photo = photo;

    await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully.',
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
        photo: user.photo,
        salary: user.salary
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile.', error: error.message });
  }
};
