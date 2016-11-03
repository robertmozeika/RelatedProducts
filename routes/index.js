var express = require('express');
var router = express.Router();
var ShopifyObj = require('./shopify.js');
var mongodb = require('mongodb');
var database = require('./database.js');
var app = require('../app.js')
// const EventEmitter = require('events');
//
// myEmitter.emit('event', "jerry");


/* GET home page. */
router.get('/', function(req, res, next) {
  router.shop_id = req.query.shop;
  database.connectDB(router.shop_id, res);
});

module.exports = router;


router.get('/thelist', function(req, res){
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');

      var collection = db.collection('shops');

      collection.find({}).toArray(function(err, result){
        if(err) {
          res.send(err)
        }else if (result.length){
          res.render('test', {
            dbresult: result,
            title: "MongoDB",
            products: "Eh"
          })
        }
      else {res.send("no dobs found")}

      db.close();

    });

    }
  })
})
