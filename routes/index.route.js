var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/read/:admin_seq', function(req, res, next) {
  res.render('read', { seq: req.params.admin_seq });
});

router.get('/create', function(req, res, next) {
  res.render('create');
});

module.exports = router;
