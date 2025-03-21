// routes/admin/courses.js
router.post('/:id/seats', adminAuth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const newSeats = parseInt(req.body.seats);
        
        if(newSeats < course.registeredStudents.length) {
            return res.render('admin/edit-course', { 
                course,
                error: `Cannot reduce seats below current registrations (${course.registeredStudents.length})`
            });
        }
        
        course.seats = newSeats;
        await course.save();
        res.redirect('/admin/courses');
    } catch (error) {
        res.status(500).render('admin/edit-course', { error: error.message });
    }
});