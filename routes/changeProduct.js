var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop_id = req.query.shop;
  var forproduct = req.query.forproduct;
  var product = req.query.product;
  var oldproduct = req.query.oldproduct;
  var title = req.query.title;
  var order = Number(req.query.order);


  // shop_id = shop_id.replace(/-/g,"_");
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');


      var collection = db.collection('RelatedProducts');
      collection.update({"forStore": shop_id, "forProduct": forproduct, "productID" : oldproduct, "order": order},{$set:{"productID": product, "title": title}}, function(err, result){
        if (err){
          res.send('failed to change')
        }
          res.send('OK')
        });
    }
  })
});



module.exports = router;
