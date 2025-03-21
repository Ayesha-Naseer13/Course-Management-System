
// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    rollNumber: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'admin'], required: true }
});

module.exports = mongoose.model('User', UserSchema);