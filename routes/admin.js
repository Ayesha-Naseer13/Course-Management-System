const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authMiddleware');
const Course = require('../models/Course');
const Student = require('../models/Student');
const studentController = require('../controllers/studentController');
const reportController = require('../controllers/reportController');
const validation = require('../middleware/validation');
router.get('/dashboard', requireAdmin, async (req, res) => {
    try {
      // Ensure courses are properly populated
      const courses = await Course.find().populate('prerequisites').exec();
      console.log('Courses loaded:', courses.length); // Debug log
      
      res.render('admin/dashboard', { 
        courses: courses || [] // Always ensure an array is passed
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.render('admin/dashboard', { courses: [] }); // Fallback empty array
    }
  });

  // Add student form
  router.get('/students/add', requireAdmin, (req, res) => {
    res.render('admin/add-student');
  });
  
  // Handle student creation
  router.post('/students', requireAdmin, async (req, res) => {
    try {
      const { rollNumber, name } = req.body;
      const student = new Student({ rollNumber, name });
      await student.save();
      res.redirect('/admin/students');
    } catch (error) {
      res.render('admin/add-student', { error: 'Error creating student' });
    }
  });


  // Update course route
router.put('/courses/:id', requireAdmin, async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            {
                code: req.body.code,
                name: req.body.name,
                prerequisites: req.body.prerequisites,
                seats: req.body.seats
            },
            { new: true }
        );
        res.redirect('/admin/courses');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
// Course Management
router.get('/courses/new', requireAdmin, async (req, res) => {
    try {
      const courses = await Course.find().select('code _id').exec();
      res.render('admin/course-form', { 
        courses // Make sure to pass courses to the template
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });
  
 // GET edit form
router.get('/courses/:id/edit', requireAdmin, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const courses = await Course.find();
        res.render('admin/course-form', { course, courses });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// DELETE course
router.delete('/courses/:id', requireAdmin, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.redirect('/admin/courses');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/courses', requireAdmin, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.render('admin/course-form', { error: 'Error creating course' });
  }
});

// Student Management
router.get('/students', requireAdmin, async (req, res) => {
  const students = await Student.find().populate('registeredCourses');
  res.render('admin/student-list', { students });
});

router.post('/students/:id/register', requireAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    student.registeredCourses.push(req.body.courseId);
    await student.save();
    res.redirect('/admin/students');
  } catch (error) {
    res.render('error', { error: 'Registration failed' });
  }
});

// Seat Management
router.post('/courses/:id/seats', requireAdmin, async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, { seats: req.body.seats });
  res.redirect('/admin/dashboard');
});

// Reports
router.get('/reports', requireAdmin, async (req, res) => {
    const reports = {
      courseStudents: await Course.findById(req.query.courseId).populate('registeredStudents'),
      availableCourses: await Course.find({ $expr: { $lt: ['$registeredStudents.length', '$seats'] } }),
      prerequisiteViolations: await Student.find().populate({
        path: 'registeredCourses',
        match: { prerequisites: { $not: { $all: '$completedCourses' } } } // Added missing brace
      })
    };
    res.render('admin/reports', { reports });
  });
  // Student Management
router.get('/students/:id', requireAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('registeredCourses');
    const courses = await Course.find();
    res.render('admin/students/detail', { student, courses });
  } catch (error) {
    res.status(500).render('error', { error: 'Student not found' });
  }
});

router.post('/students/:id/courses', requireAdmin, studentController.overrideRegistration);
router.delete('/students/:studentId/courses/:courseId', requireAdmin, studentController.removeRegistration);

// Reports
router.get('/reports/students-in-course', requireAdmin, reportController.studentsInCourse);
router.get('/reports/available-seats', requireAdmin, reportController.availableSeats);
router.get('/reports/missing-prerequisites', requireAdmin, reportController.missingPrerequisites);

// Enhanced Course Deletion
router.delete('/courses/:id', requireAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    
    // Remove from students' registrations
    await Student.updateMany(
      { registeredCourses: req.params.id },
      { $pull: { registeredCourses: req.params.id } }
    );

    // Remove from prerequisites
    await Course.updateMany(
      { prerequisites: req.params.id },
      { $pull: { prerequisites: req.params.id } }
    );

    res.redirect('/admin/courses');
  } catch (err) {
    res.status(500).render('error', { error: 'Failed to delete course' });
  }
});
module.exports = router;


