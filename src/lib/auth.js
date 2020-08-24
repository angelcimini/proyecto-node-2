module.exports = {
    usuarioRegistrado (req,res,next) {
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/signin');
    },
    usuarioNoRegistrado (req,res,next) {
        if(!req.isAuthenticated()){
            return next();
        }
        return res.redirect('/profile');
    }
}