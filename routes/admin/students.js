// routes/admin/students.js
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const { adminAuth } = require('../middleware/auth');

// View all students
router.get('/', adminAuth, async (req, res) => {
    try {
        const students = await Student.find().populate('registeredCourses');
        res.render('admin/students', { students });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Manage student registrations
router.get('/:id/registrations', adminAuth, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('registeredCourses completedCourses');
        const courses = await Course.find();
        res.render('admin/student-registrations', { student, courses });
    } catch (error) {
        res.redirect('/admin/students');
    }
});

// Override registration
router.post('/:id/registrations', adminAuth, async (req, res) => {
    try {
        const { courseId, action } = req.body;
        const student = await Student.findById(req.params.id);
        const course = await Course.findById(courseId);

        if(action === 'enroll') {
            // Admin override enrollment
            if(!course.registeredStudents.includes(student._id)) {
                if(course.registeredStudents.length >= course.seats) {
                    // Auto-increase seats if needed
                    course.seats = course.registeredStudents.length + 1;
                }
                course.registeredStudents.push(student._id);
                student.registeredCourses.push(course._id);
            }
        } else {
            // Remove registration
            course.registeredStudents.pull(student._id);
            student.registeredCourses.pull(course._id);
        }

        await student.save();
        await course.save();
        res.redirect(`/admin/students/${req.params.id}/registrations`);
    } catch (error) {
        res.render('admin/student-registrations', { error: error.message });
    }
});