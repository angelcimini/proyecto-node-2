const express = require('express');
const router = express.Router();
const passport = require('passport');
const { usuarioRegistrado, usuarioNoRegistrado } = require('../lib/auth');

router.get('/signup', usuarioNoRegistrado, (req,res) =>{
    res.render('auth/signup');
});

router.post('/signup', usuarioNoRegistrado, passport.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

// router.post('/signup', (req, res) => {
//     passport.authenticate('local.signup', {
//         successRedirect: '/profile',
//         failureRedirect: '/signup',
//         failureFlash: true
//     });
//     console.log(req.body);
//     res.send('received');
// });

router.get('/signin', usuarioNoRegistrado, (req,res) =>{
    res.render('auth/signin');
});

router.post('/signin', usuarioNoRegistrado, (req,res,next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next);
});

router.get('/profile', usuarioRegistrado, (req,res) => { 
    res.render('profile');
});

router.get('/logout', usuarioRegistrado, (req,res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;