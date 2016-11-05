var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  router.shop_id = req.query.shop;
  database.connectDB(router.shop_id, res);
});

module.exports = router;
