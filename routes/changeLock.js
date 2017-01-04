var express = require('express');
var router = express.Router();
var spModel = require('../models/storeProducts.js')


/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  var spSchema = {
    'store': req.session.shop,
    'productID': req.body.productID,

  }
  var specifiedLock = 'locks.' + req.body.index.toString();
  console.log(specifiedLock)
  var setter = {};
  setter[specifiedLock] = req.body.bool;
  // var selectedProduct = new spMode(spSchema);
  spModel.findOneAndUpdate(spSchema,{$set:setter}, {upsert: false}, function(err,suc){
    if (err){
      console.log(err)
      res.send(err)
    } else{
      console.log('44',suc)
    res.send(suc)
    }
  })
  // .catch(function(err){
  //   console.log(err)
  // })
});

module.exports = router;
