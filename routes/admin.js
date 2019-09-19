const express = require('express');
const router = express.Router();
const { adminAuth } = require('../config/auth')

router.all('*', adminAuth, (req, res, next) => {
  next();
})

/* GET home page. */
router.get('/', (req, res) => {
  res.render('admin/index', { title: 'Admin', login: req.user.login });
});

module.exports = router;
