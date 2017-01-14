var express = require('express');
var router = express.Router();
var authorize = require('../custom_modules/authorize.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  //saves shop name for later use with accessing database
  req.session.shop = req.query.shop.replace('.myshopify', "").replace('.com', "");
  console.log('session: ',req.session)
  authorize.connectShop(req.session.shop, req, res)

});

module.exports = router;
