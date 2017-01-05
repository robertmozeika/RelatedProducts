var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop_id = req.query.shop;
  var product_id = req.query.product;
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');

      function searchRP(){
        return new Promise(function(resolve, reject){
          var collection = db.collection('RelatedProducts');
          collection.find({"forStore":shop_id, "forProduct":product_id}).toArray(function(err, result){
            if (err){
              reject(err)
            } else {
            resolve(result);
            }
          });
        })
      }

      function searchBP(){
        return new Promise(function(resolve, reject){
          var collection = db.collection('alsoBoughtProducts');
          collection.find({"forStore":shop_id, "forProduct":product_id}).toArray(function(err, result){
            resolve(result);
          });
        })
      }

      Promise.all([
        searchRP(),
        searchBP(),



      ]).then(function(values){
        var sendObj = {
          products: values[0],
          alsoBought: values[1]
        }

        res.send(sendObj)

      }).catch(reason => {
        console.log(reason)});


    }
  })
});



module.exports = router;
