const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  schedule: {
    days: [String],
    time: String,
    room: String
  },
  seats: {
    type: Number,
    required: true
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  registeredStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }],
    startTime: String,
    endTime: String,
    room: String
  }
}, { timestamps: true });

// Prevent self-prerequisites
courseSchema.pre('save', function(next) {
  if (this.prerequisites.includes(this._id)) {
    throw new Error('Course cannot be its own prerequisite');
  }
  next();
});


module.exports = mongoose.model('Course', courseSchema);