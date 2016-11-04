var ShopifyObj = require('./shopify.js');

var mongodb = require('mongodb');
var index = require('../routes/index.js');
var express = require('express');
var fs = require('fs');



var dbObj = {
  initDB: function(){
    var server = new mongodb.Server("127.0.0.1", 27017, {});
      new mongodb.Db('test', server, {w: 1}).open(function (error, client) {
        //export the client and maybe some collections as a shortcut
        module.exports.client = client;
        module.exports.myCollection = new mongodb.Collection(client, 'myCollection');
        callback(error);
      });
  },
  connectDB: function(shopname, res){
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/shopify"
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log('Unable to connect' + err)
      } else {
        console.log('Connection between Database Success');

        var collection = db.collection('shops');

        collection.find({}).toArray(function(err, result){
          console.log(result)
          if(err) {
            res.send(err)
          }else if (result.length){
            console.log(result)
            var shop_id = shopname.replace(".myshopify.com", "");
            var nametest = {name: shop_id};
            var foundmatch = false;
            for(var j = 0; j <result.length; ++j) {
                if(result[j].name == nametest.name){
                  foundmatch = result[j].access_token;
                }
            };
            if (foundmatch){
              ShopifyObj.tempNeeded = false;
              ShopifyObj.connectShopify(shop_id, foundmatch);
              var auth_url = ShopifyObj.Shopify.buildAuthURL();
              res.redirect(auth_url);
            }
            else {
              ShopifyObj.tempShopify(shop_id);
              var auth_url = ShopifyObj.Shopify.buildAuthURL();
              res.redirect(auth_url);
            }
          }
        else {res.send("no dobs found")}

        db.close();

      });

      }
    })
  },
  accessToken: null,
  saveAccessToken: function(shopArg, access_token, res){
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/shopify"
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log('Unable to connect' + err)
      } else {
        console.log('Connection between Database Success');

        var collection = db.collection('shops');

        collection.find({}).toArray(function(err, result){
          console.log(result)
          if(err) {
            res.send(err)
          }else if (result.length){
            var shopname = shopArg;
            var shop_id = shopname.replace(".myshopify.com", "");
            var nametest = {name: shop_id};
            var foundmatch = false;
            for(var j = 0; j <result.length; ++j) {
                if(result[j].name == nametest.name){
                  foundmatch = result[j].access_token;
                }
            };
            if (foundmatch){
              console.log(foundmatch)
            }
            else {
              collection.insert({"name": shop_id, "access_token": access_token});
              res.redirect('/?shop=' + shop_id);

            }
          }
        else {res.send("no dobs found")}

        db.close();

      });

      }
    })
  },
  getNumOfRel: function(res){
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/shopify"
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log('Unable to connect' + err)
      } else {
        console.log('Connection between Database Success');

        var collection = db.collection('shops');

        collection.find({"name" : "test-store-1994-1994"}).toArray(function(err, result){
          console.log("lookhere")
          console.log(result[0].products)

          if(err) {

          }else if (result.length){
            var resultingArr = [];
            result[0].products.forEach(function(element){
              var str1 = element.numOfRel.toString();
              var push1 = element.productID.concat(str1);
              resultingArr.push(push1);
            })
            console.log(resultingArr)
            ShopifyObj.readAllProducts(res, resultingArr)
          }
        else {}

        db.close();

      });

      }
    })


  },
}

module.exports = dbObj
