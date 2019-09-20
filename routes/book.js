const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('book', { title: 'Book your table', login: req.user ? req.user.login : undefined });
});

module.exports = router;
