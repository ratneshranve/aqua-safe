const User = require('../models/User');
const Engineer = require('../models/Engineer');
const Report = require('../models/Report');
const Alert = require('../models/Alert');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const ZONE_NAMES = {
  'Z-1': 'Rajwada Circle',
  'Z-2': 'Vijay Nagar',
  'Z-3': 'Old Palasia',
  'Z-4': 'Bhanwarkuan',
  'Z-5': 'Annapurna Road',
  'Z-6': 'Sarafa Bazaar',
  'Z-7': 'Khajrana Area',
  'Z-8': 'Mhow Naka',
  'Z-9': 'Sudama Nagar',
  'Z-10': 'Banganga',
  'Z-11': 'Aerodrome Road',
  'Z-12': 'Rau Area',
  'Z-13': 'Azad Nagar',
  'Z-14': 'Musakhedi',
  'Z-15': 'Pipliyahana',
  'Z-16': 'Malwa Mill',
  'Z-17': 'Patnipura',
  'Z-18': 'Sukhlia',
  'Z-19': 'LIG Square'
};

// Dashboard Map Data
exports.getDashboardData = async (req, res) => {
  try {
    const alerts = await Alert.find();
    
    const zoneData = {};
    for(let i=1; i<=19; i++) {
      const zoneId = `Z-${i}`;
      zoneData[zoneId] = {
        status: 'Green',
        name: ZONE_NAMES[zoneId] || 'Unknown Area'
      };
    }

    alerts.forEach(alert => {
      const { zone } = alert;
      if (zone && zoneData[zone]) {
        zoneData[zone].status = 'Red';
      }
    });

    res.json(zoneData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to DB
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send Email
    await sendEmail({
      email,
      subject: 'AquaSafe - Verification OTP',
      message: `Your verification OTP for adding a new user/engineer is: ${otp}. This OTP is valid for 10 minutes.`,
      html: `<h3>AquaSafe Verification</h3><p>Your verification OTP is: <strong>${otp}</strong></p><p>This OTP is valid for 10 minutes.</p>`
    });

    res.json({ message: 'OTP sent successfully to ' + email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, phone, meterId, zone, tank, ward, otp } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name, email, password: hashedPassword, phone, meterId, zone, tank, ward
    });
    
    await user.save();
    await OTP.deleteOne({ _id: otpRecord._id }); // Use OTP once
    
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Engineers
exports.getEngineers = async (req, res) => {
  try {
    const engineers = await Engineer.find().select('-password');
    res.json(engineers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEngineer = async (req, res) => {
  try {
    const { name, email, password, phone, zone, otp } = req.body;

    // Verify OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const engineer = new Engineer({
      name, email, password: hashedPassword, phone, zone
    });
    
    await engineer.save();
    await OTP.deleteOne({ _id: otpRecord._id }); // Use OTP once

    res.status(201).json({ message: 'Engineer added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEngineer = async (req, res) => {
  try {
    await Engineer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Engineer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ assignedEngineer: null, status: { $ne: 'Resolved' } }).populate('user', 'name phone meterId');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const reports = await Report.find({ assignedEngineer: { $ne: null }, status: { $ne: 'Resolved' } })
      .populate('user', 'name phone meterId')
      .populate('assignedEngineer', 'name email zone');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResolvedReports = async (req, res) => {
  try {
    const reports = await Report.find({ status: 'Resolved' })
      .populate('user', 'name phone meterId')
      .populate('assignedEngineer', 'name email zone');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignEngineer = async (req, res) => {
  try {
    const { reportId, engineerId } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    report.assignedEngineer = engineerId;
    await report.save();

    req.app.get('io').to('Engineer').emit('taskAssigned', report); // simplistic

    res.json({ message: 'Engineer assigned successfully', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Alerts
exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().populate('user', 'name phone').populate('assignedEngineer', 'name').sort({ dateTime: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignEngineerToAlert = async (req, res) => {
  try {
    const { alertId, engineerId } = req.body;
    const alert = await Alert.findById(alertId);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    // Assign engineer to alert
    alert.assignedEngineer = engineerId;
    await alert.save();

    // Create a new Report directly assigned to the engineer
    const newReport = new Report({
      meterId: alert.meterId,
      user: alert.user,
      zone: alert.zone,
      tank: alert.tank,
      ward: alert.ward,
      reason: 'SYSTEM ALERT: ' + alert.reason,
      status: 'Pending',
      assignedEngineer: engineerId
    });
    
    await newReport.save();

    req.app.get('io').to('Engineer').emit('taskAssigned', newReport);

    res.json({ message: 'Engineer assigned to alert successfully', alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
