const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', ensureAuthenticated, (req, res, next) => {
  res.render('account', { title: 'Account', login: req.user.login });
});

module.exports = router;
