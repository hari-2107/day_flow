const Attendance = require('../models/Attendance');
const User = require('../models/User');


const getTodayString = () => {
  const date = new Date();
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};


const getTimeString = () => {
  const date = new Date();
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};


exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayString();
    const nowTime = getTimeString();

    const user = await User.findByPk(userId);

    let record = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (record) {
      if (record.check_in) {
        return res.status(400).json({ message: 'Already checked in today.', record });
      }
      record.check_in = nowTime;
      record.status = 'Present';
      await record.save();
    } else {
      record = await Attendance.create({
        user_id: userId,
        employee_id: req.user.employee_id || (user ? user.employee_id : `EMP-${userId}`),
        user_name: user ? user.name : req.user.email,
        date: today,
        check_in: nowTime,
        check_out: '--',
        working_hours: '--',
        status: 'Present'
      });
    }

    return res.status(200).json({ message: 'Checked in successfully.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking in.', error: error.message });
  }
};


exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getTodayString();
    const nowTime = getTimeString();

    let record = await Attendance.findOne({
      where: { user_id: userId, date: today }
    });

    if (!record || !record.check_in) {
      return res.status(400).json({ message: 'You must check in before checking out.' });
    }

    record.check_out = nowTime;
    record.working_hours = '8h 00m'; 
    await record.save();

    return res.status(200).json({ message: 'Checked out successfully.', record });
  } catch (error) {
    return res.status(500).json({ message: 'Error checking out.', error: error.message });
  }
};


exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await Attendance.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching attendance logs.', error: error.message });
  }
};


exports.getAdminAttendance = async (req, res) => {
  try {
    const logs = await Attendance.findAll({
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ logs });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching all attendance logs.', error: error.message });
  }
};
