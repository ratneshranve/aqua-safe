const mongoose = require('mongoose');

const EngineerSchema = new mongoose.Schema({
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
  zone: { type: String, required: true },
  role: { type: String, default: 'Engineer' }
});

module.exports = mongoose.model('Engineer', EngineerSchema);
