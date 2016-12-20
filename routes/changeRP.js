var express = require('express');
var router = express.Router();
var rpModel = require('../models/relatedProducts.js');
// var shopModel = require('../models/shops.js');


/* GET users listing. */
router.post('/', function(req, res, next) {
  var postData = req.body;
  console.log(postData)
  postData.forStore = req.session.shop;

  var query = {
    forProduct:postData.productID,
    order: postData.order,
    forStore:postData.forStore
  };
  var newData = {
    'productID': postData.newProduct.productID,
    'title': postData.newProduct.productName,
    'image': postData.newProduct.image,
  }
  console.log(query)
  console.log(newData)
  rpModel.findOneAndUpdate(query, newData, {upsert:false}, function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
  });


});


module.exports = router;
