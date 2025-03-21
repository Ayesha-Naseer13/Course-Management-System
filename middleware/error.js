exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
      error: process.env.NODE_ENV === 'development' ? err : 'Something went wrong!'
    });
  };