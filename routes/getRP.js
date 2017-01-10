var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const verifyHMAC = require('../custom_modules/verifyHMAC.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  if (verifyHMAC(req.headers.referer,true)){
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
              collection.find({"store":shop_id, "forProduct":product_id}).toArray(function(err, result){
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
              collection.find({"store":shop_id, "forProduct":product_id}).toArray(function(err, result){
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
  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }
});



module.exports = router;
