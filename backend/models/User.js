const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: { type: String, required: true },
  phone: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, 'Please fill a valid 10-digit phone number']
  },
  role: { type: String, default: 'User' },
  meterId: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^METER-\d+$/, 'Please fill a valid Meter ID (e.g., METER-01)']
  },
  zone: { type: String, required: true },
  tank: { type: String, required: true },
  ward: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
