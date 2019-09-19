const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', ensureAuthenticated, async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email });
  if(!user.accepted) {
    req.logOut();
    req.flash('error_msg', 'You must first confirm your email!');
    res.redirect('/user/login')
  }
  res.render('account', { title: 'Account', login: req.user.login });
});

module.exports = router;
