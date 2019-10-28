const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('menu', { title: 'Menu', login: req.user ? req.user.login : undefined });
});

module.exports = router;
