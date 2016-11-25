var express = require('express');
var router = express.Router();
var database = require('../custom_modules/database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  var toRouter = req.query.shop.replace('.myshopify.com', "");
  router.shop_id = toRouter;
  req.session.shop = toRouter;


  database.connectDB(router.shop_id, res);
});

module.exports = router;
