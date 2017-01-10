var express = require('express');
var router = express.Router();
var setAll = require('../custom_modules/setAllMostBought.js');
const verifyHMAC = require('../custom_modules/verifyHMAC.js');

/* GET users listing. */
router.post('/', function(req, res, next) {
  if (verifyHMAC(req.headers.referer,true)){

    setAll(req.body.checked,req.session.shop).then(function(data){
      res.send(data);
    })
  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }
});

module.exports = router;
