var express = require('express');
var router = express.Router();
var authorize = require('../custom_modules/authorize.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  //ensure this is coming from shopify, otherwise people would be able to act like they are another shop
  var toRouter = req.query.shop.replace('.myshopify.com', "");
  toRouter = toRouter.replace('.com', "")
  // router.shop_id = toRouter;
  req.session.shop = toRouter;
  console.log(req.session.shop)
  authorize.connectShop(req.session.shop, req, res)

});

module.exports = router;
