const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.redirect('/login');
    }
    next();
};

const requireStudent = (req, res, next) => {
    if (req.session.role !== 'student') {
        return res.redirect('/login');
    }
    next();
};
exports.adminAuth = (req, res, next) => {
    if (req.session.adminId) {
        return next();
    }
    res.redirect('/');
};

// Add to server.js:
// app.use('/admin', require('./routes/admin'));
module.exports = { requireAuth, requireAdmin, requireStudent };