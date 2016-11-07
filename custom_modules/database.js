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
  exportCollection: function(){
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/shopify"
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log('Unable to connect' + err)
      } else {
        console.log('Connection between Database Success at connectDB');

        var collection = db.collection('shops');

        return collection

      }
    })
  },
  connectDB: function(shopname, res){
    var MongoClient = mongodb.MongoClient;

    var url = "mongodb://localhost:27017/shopify"
    MongoClient.connect(url, function(err, db){
      if(err){
        console.log('Unable to connect' + err)
      } else {
        console.log('Connection between Database Success at connectDB');

        var collection = db.collection('shops');

        collection.find({}).toArray(function(err, result){
          if(err) {
            res.send(err)
          }else if (result.length){
            console.log("success getting result Length at database.js connectDB")
            var nametest = {name: shopname};
            var foundmatch = false;
            for(var j = 0; j <result.length; ++j) {
                if(result[j].name == nametest.name){
                  foundmatch = result[j].access_token;
                }
            };
            if (foundmatch){
              ShopifyObj.tempNeeded = false;
              ShopifyObj.connectShopify(shopname, foundmatch);
              var auth_url = ShopifyObj.Shopify.buildAuthURL();
              res.redirect(auth_url);
            }
            else {
              ShopifyObj.tempShopify(shopname);
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
          if(err) {
            res.send(err)
          }else if (result.length){
            var shopname = shopArg;
            var nametest = {name: shopname};
            var foundmatch = false;
            for(var j = 0; j <result.length; ++j) {
                if(result[j].name == nametest.name){
                  foundmatch = result[j].access_token;
                }
            };
            if (foundmatch){
              console.log(" access token is already in DB " + foundmatch)
            }
            else {
              collection.insert({"name": shopname, "access_token": access_token});
              res.redirect('/?shop=' + shopname);

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
        console.log('Connection between Database Success at getNumOfRel');

        var collection = db.collection('shops');

        collection.find({"name" : "test-store-1994-1994"}).toArray(function(err, result){

          if(err) {

          }else if (result.length){
            var resultingArr = [];
            result[0].products.forEach(function(element){
              var str1 = element.numOfRel.toString();
              var push1 = element.productID.concat(str1);
              resultingArr.push(push1);
            })
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
