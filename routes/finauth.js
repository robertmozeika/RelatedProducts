var express = require('express');
var router = express.Router();
var renderMain = require('../custom_modules/renderMain.js');
const verifyHMAC = require('../custom_modules/verifyHMAC.js')

// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){
  // console.log('##',req.query)
  // const { hmac, code, shop, timestamp, state } = req.query;
  // console.log('hmac',hmac);
  // console.log('code',code);
  // console.log('shop',shop, timestamp);
  //
  // const message = `code=${code}&shop=${shop}&state=${state}&timestamp=${timestamp}`;
  // console.log('message',message)
  //
  // // recompute hmac
  //        var compute_hmac= crypto.createHmac('sha256', '6815b758b2996ee3ef116c112432a085').update(message).digest('hex');
  //        console.log('compute',compute_hmac)
  //        // check hmac
  //        if(compute_hmac != hmac){
  //         //  return res.status(403).json({error:"Security check failed"});
  //         console.log('not same')
  //        }
  //        else
  //        {
  //           // do stg
  //           // return res.status(200).json({success:"ok"});
  //           console.log('same')
  //        }

  if (verifyHMAC(req.query)){
    var store = req.session.shop;
    var shopify = req.session.shopifyconfig;
    // res.send(shopify)
    renderMain(res, store, shopify)
  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }






});

module.exports = router;
