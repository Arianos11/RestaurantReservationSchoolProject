const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Table = require('../models/table');
const { ensureAuthenticated } = require('../config/auth');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('book', { title: 'Book your table', login: req.user ? req.user.login : undefined });
});

router.get('/tables', (req, res, next) => {
  res.status('200').json({
    status: "success"
  });
})

module.exports = router;
