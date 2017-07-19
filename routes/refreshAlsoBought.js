var express = require('express');
var router = express.Router();
const verifyHMAC = require('../custom_modules/verifyHMAC.js');
var shopModel = require('../models/shops.js');
const updateProductInfo = require('../custom_modules/updateProductInfo.js');
const updateAlsoBought = require('../custom_modules/updateAlsoBought.js');
var createShopConfig = require('../custom_modules/createShopConfig.js')






/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop = req.session.shop;
  const VerifyHMAC = new verifyHMAC(req.headers.referer,true,verifySuccess,res);
  function verifySuccess(){
        console.log('verified and proceeding')
        shopModel.find({name: shop})
          .then(function(doc){
            if (doc.length){
              const shopifyconfig = createShopConfig(shop,doc[0].access_token)

              updateProductInfo(shopifyconfig,shop).then(data => {
                updateAlsoBought(shopifyconfig,shop);
              });
            }
          })
          .catch(err => {
            res.send('An error has occurred, please let developer know at robertmozeika20@gmail.com');
          })
  }
});

module.exports = router;
