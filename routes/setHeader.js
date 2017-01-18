var express = require('express');
var router = express.Router();
var shopModel = require('../models/shops.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const VerifyHMAC = new verifyHMAC(req.headers.referer,true,verifySuccess,res);
  function verifySuccess(){
    var header = req.query.header;
    shopModel.update({name: req.session.shop},{$set:{header: header}})
      .then(function(){
        res.send('update header')
      })
  }
  // const verifyHMAC = require('../custom_modules/verifyHMAC.js');
  // if (verifyHMAC(req.headers.referer,true)){
  //   var header = req.query.header;
  //   shopModel.update({name: req.session.shop},{$set:{header: header}})
  //     .then(function(){
  //       res.send('update header')
  //     })
  // } else {
  //   res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  // }

});

module.exports = router;
