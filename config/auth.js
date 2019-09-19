module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/user/login');
    },

    adminAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            console.log(req.user);
            if(req.user.role !== 'admin') {
                req.flash('error_msg', "You do not have access to this page");
                res.redirect('/user/login');
            }
            return next();
        }
        req.flash('error_msg', 'Please log in to view this resource');
        res.redirect('/user/login');
    }
}
