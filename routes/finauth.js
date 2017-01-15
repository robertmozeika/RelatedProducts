var express = require('express');
var router = express.Router();
var renderMain = require('../custom_modules/renderMain.js');
const VerifyHMAC = require('../custom_modules/verifyHMAC.js');
const FinAuth = require('../custom_modules/FinAuth.js')

// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){


  // function sendGood(){
  //   res.send('good')
  // }
  // function sendBad(){
  //   res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  // }
  // console.log('made it here')
  // var verifyHMAC = new VerifyHMAC(req.query,false,sendGood.bind(this),sendBad.bind(this))
  // console.log(verifyHMAC)
  // verifyHMAC.init();


  const finAuth = new FinAuth(res,req,req.session.shop,req.session.shopifyconfig)
  console.log(finAuth.init())
  //
  // if(req.query.code || req.query.protocol) {
  //   console.log('there is a code')
  //   if (verifyHMAC(req.query)){
  //     var store = req.session.shop;
  //     var shopify = req.session.shopifyconfig;
  //     // res.send(shopify)
  //     renderMain(res, store, shopify)
  //   } else {
  //
  //     res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  //   }
  // }
  //
  //
  //
  // else {
  //   console.log('no code')
  //   console.log(req.headers.referer)
  //   if (verifyHMAC(req.headers.referer,true)){
  //     var store = req.session.shop;
  //     var shopify = req.session.shopifyconfig;
  //     // res.send(shopify)
  //     renderMain(res, store, shopify)
  //   } else {
  //
  //
  //     res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  //   }
  //
  // }






});

module.exports = router;
