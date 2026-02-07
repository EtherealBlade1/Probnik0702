const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName:    { type: String, required: true, match: /^[А-Яа-яЁё\s]+$/ },
  phone:       { type: String, required: true, match: /^\+7\(\d{3}\)-\d{3}-\d{2}-\d{2}$/ },
  email:       { type: String, required: true, match: /.+@.+\..+/ },
  login:       { type: String, required: true, unique: true },
  password:    { type: String, required: true, minlength: 8 },
  role:        { type: String, default: 'user', enum: ['user', 'admin'] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);