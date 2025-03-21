// routes/admin/reports.js
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student');

// Students in Course report
router.get('/students-in-course/:courseId', adminAuth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId)
            .populate('registeredStudents');
        res.render('admin/reports/students-in-course', { course });
    } catch (error) {
        res.redirect('/admin/reports');
    }
});

// Courses with available seats
router.get('/available-seats', adminAuth, async (req, res) => {
    try {
        const courses = await Course.aggregate([
            {
                $addFields: {
                    availableSeats: {
                        $subtract: ["$seats", { $size: "$registeredStudents" }]
                    }
                }
            },
            { $match: { availableSeats: { $gt: 0 } } }
        ]);
        res.render('admin/reports/available-seats', { courses });
    } catch (error) {
        res.redirect('/admin/reports');
    }
});

// Students missing prerequisites
router.get('/missing-prerequisites', adminAuth, async (req, res) => {
    try {
        const students = await Student.find()
            .populate({
                path: 'registeredCourses',
                populate: { path: 'prerequisites' }
            })
            .populate('completedCourses');

        const results = students.map(student => {
            const issues = [];
            student.registeredCourses.forEach(course => {
                const missing = course.prerequisites.filter(p => 
                    !student.completedCourses.some(c => c._id.equals(p._id))
                );
                if(missing.length > 0) {
                    issues.push({
                        course: course.name,
                        missing: missing.map(m => m.code)
                    });
                }
            });
            return issues.length > 0 ? { student, issues } : null;
        }).filter(Boolean);

        res.render('admin/reports/missing-prerequisites', { results });
    } catch (error) {
        res.redirect('/admin/reports');
    }
});