var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  //处理一些业务并返回下面数据
  // res.render('index', { title: 'Express' });
  res.json({name:'gl',pwd:'123'});
});

module.exports = router;
