var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop_id = req.query.shop;
  shop_id = shop_id.replace(/-/g,"_");
  console.log(shop_id)
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');


      var collection = db.collection(shop_id + "StoreProducts");
      collection.find({}).toArray(function(err, result){
        res.json(result);
      });
    }
  })
});



module.exports = router;
