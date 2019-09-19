const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../config/auth');
let errors = [];
const pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
/* GET users listing. */
router.get('/register', (req, res, next) => {
  res.render('register', { errors });
});

router.post('/register', async (req,res) => {
  errors = [];
  const { login, email, password, passwordConfirm } = req.body;

  if (!login || !email || !password || !passwordConfirm) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (login === "admin" || login === "Admin") {
    errors.push({ msg: 'This username is not allowed'});
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

  // Change name

  router.get('/changeName', ensureAuthenticated, (req, res) => {
    res.render('changeName', {login: req.user.login});
  });

  router.post('/changeName', async (req,res) => {
    const errors = [];
    const { name, name2 } = req.body;
    if (!name) {
      errors.push({ msg: 'NONAME!' });
    }
    if (name != name2) {
      errors.push({ msg: 'Names do not match' });
    }
    if(name.length > 20)
    {
      errors.push({ msg: 'Too long name!'});
    }

    if (errors.length > 0) {
      req.flash('error_msg', errors[0].msg);
      res.redirect('/user/changeName');
    } else {
      const user = await User.findOne({ _id: req.user._id });
      user.login = name;
      await user.save();
      req.flash('success_msg', 'Your name has been changed!');
      res.redirect('/account');
    } 
  });

  //Change Password

  router.get('/changePassword', ensureAuthenticated, (req, res) => {
    res.render('changePassword', {login: req.user.login, errors});
  });

  router.post('/changePassword', async (req,res) => {
    const errors = [];
    const { password, password2 } = req.body;
    if (!password) {
      errors.push({ msg: 'NOPASSWORD!' });
    }
    if (password != password2) {
      errors.push({ msg: 'Password do not match' });
    }
    if (password.length < 8) {
      errors.push({ msg: 'Password must be at least 8 characters' });
    }
  
    if(!pattern.test(password)) {
      errors.push({ msg: 'Password requires uppercase, numbers and special characters' });
    }

    if (errors.length > 0) {
      req.flash('error_msg', errors[0].msg);
      res.render('changePassword', { errors, login: req.user.login });
    } else {
      const user = await User.findOne({ _id: req.user._id });
      await bcrypt.genSalt(12, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {
        if(err) throw err;
        user.password = hash;
        user.save().then(user => {
          req.flash('success_msg', 'Your password has been changed');
          res.redirect('/account')
        })
        .catch(err => console.log(err));
    })); 
  }});


module.exports = router;
