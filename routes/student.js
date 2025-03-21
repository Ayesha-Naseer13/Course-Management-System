const express = require('express');
const router = express.Router();
const { requireStudent } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Student = require('../models/Student');

// Student Dashboard
router.get('/dashboard', requireStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.session.user._id)
      .populate('registeredCourses')
      .populate('completedCourses');
    
    res.render('student/dashboard', { 
      student,
      schedule: req.session.tentativeSchedule || []
    });
  } catch (error) {
    res.render('error', { error: 'Failed to load dashboard' });
  }
});

// Course Registration Endpoint
router.post('/courses/register', requireStudent, async (req, res) => {
  try {
    const course = await Course.findById(req.body.courseId);
    const student = await Student.findById(req.session.user._id);

    // Check prerequisites
    const missingPrereqs = course.prerequisites.filter(p => 
      !student.completedCourses.includes(p)
    );
    
    if(missingPrereqs.length > 0) {
      return res.status(400).json({ 
        error: 'Missing prerequisites',
        missingPrereqs
      });
    }

    // Check schedule conflicts
    const conflicts = student.registeredCourses.concat(req.session.tentativeSchedule || [])
      .some(c => c.schedule.days.some(day => 
        course.schedule.days.includes(day) && 
        c.schedule.time === course.schedule.time
      ));

    if(conflicts) {
      return res.status(400).json({ error: 'Schedule conflict' });
    }

    // Add to tentative schedule
    req.session.tentativeSchedule = req.session.tentativeSchedule || [];
    req.session.tentativeSchedule.push(course);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});
// Get current schedule
router.get('/api/schedule', requireStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.session.studentId)
      .populate('registeredCourses')
      .populate({
        path: 'tentativeSchedule',
        select: 'code schedule prerequisites'
      });

    res.json({
      registered: student.registeredCourses,
      tentative: student.tentativeSchedule || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load schedule' });
  }
});

// Course updates SSE endpoint
router.get('/api/courses/updates', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = (courseId, availableSeats) => {
    res.write(`data: ${JSON.stringify({ courseId, availableSeats })}\n\n`);
  };

  // Listen for course changes (you'll need to implement this in your course model)
  Course.watch().on('change', (change) => {
    if (change.operationType === 'update') {
      const courseId = change.documentKey._id;
      const availableSeats = change.updateDescription.updatedFields.seats;
      if (availableSeats) {
        sendUpdate(courseId, availableSeats);
      }
    }
  });
});

// Filter courses API
router.get('/api/courses', async (req, res) => {
  try {
    const query = {};
    
    if (req.query.department) {
      query.department = req.query.department;
    }
    
    if (req.query.time) {
      query['schedule.startTime'] = { $regex: new RegExp(req.query.time, 'i') };
    }

    const courses = await Course.find(query)
      .populate('prerequisites', 'code')
      .lean();

    res.json(courses.map(course => ({
      ...course,
      availableSeats: course.seats - course.registeredStudents.length
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load courses' });
  }
});

module.exports = router;