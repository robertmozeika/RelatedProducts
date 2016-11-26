var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop_id = req.query.shop;
  var product_id = req.query.product;
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');


      var collection = db.collection('RelatedProducts');
      collection.find({"forStore":shop_id, "forProduct":product_id}).toArray(function(err, result){
        res.json(result);
      });
    }
  })
});



module.exports = router;
