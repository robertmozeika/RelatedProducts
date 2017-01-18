var express = require('express');
var router = express.Router();
var authorize = require('../custom_modules/authorize.js')

console.log(global.url)
/* GET home page. */
router.get('/', function(req, res, next) {
  //saves shop name for later use with accessing database
  if (req.query.shop){
    req.session.shop = req.query.shop.replace('.myshopify', "").replace('.com', "");
    console.log('session: ',req.session)
    authorize.connectShop(req.session.shop, req, res)
  } else {
    res.send('Please go to <a href="' + global.url + 'install">' + global.url + 'install</a>')
  }
});

module.exports = router;
