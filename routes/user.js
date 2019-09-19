const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
let errors = [];
/* GET users listing. */
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Register', errors });
});

router.post('/register', async (req,res) => {
  errors = [];
  const { login, email, password, passwordConfirm } = req.body;
  const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  if (!login || !email || !password || !passwordConfirm) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != passwordConfirm) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 8) {
    errors.push({ msg: 'Password must be at least 8 characters' });
  }

  if(!pattern.test(password)) {
    errors.push({ msg: 'Password requires uppercase, numbers and special characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      login,
      email,
      password,
      passwordConfirm
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if(user) {
        errors.push({ msg: 'Email is already existing'})
        res.render('register', {
          errors,
          login,
          email,
          password,
          passwordConfirm
        });
      } else {
        const newUser = new User({
          login,
          email,
          password
        })
        bcrypt.genSalt(12, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save().then(user => {
            req.flash('success_msg', 'You are now registered and can log in')
            res.redirect('/user/login')
          })
          .catch(err => console.log(err));
        }));
      }
    });
  }
});

//Login

router.get('/login', (req, res, next) => {
    if(req.isAuthenticated())
    {
        res.redirect('/account')
    }
    res.render('login', { title: 'Login' });
  });
  
  router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/account',
      failureRedirect: '/user/login',
      failureFlash: true
    })(req, res, next)
  });

  //logout

  router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login')
  });

module.exports = router;
