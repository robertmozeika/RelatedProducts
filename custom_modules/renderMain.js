var ShopifyObj = require('./shopify.js');

var mongodb = require('mongodb');
var index = require('../routes/index.js');
var express = require('express');
var fs = require('fs');
var getShop = require('./getShopifyData.js');




 function getNumOfRel(res){
   var numOfArr = [];
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

          result[0].products.forEach(function(element){
            var str1 = element.numOfRel.toString();
            var push1 = element.productID.concat(str1);
            numOfArr.push(push1);
          })

          var promise = getShop();

          promise.then(function(fromResolve){
            console.log("We got from resolve");
            console.log(fromResolve);
            var dog = "doggie"
            return dog
          }).catch(function(fromReject){
            console.log("we got reject");
            console.log(fromReject)
          }).then(function(inp){
            console.log(inp)
          })


          ShopifyObj.readAllProducts(res, numOfArr);

        }
      else {}

      db.close();

    });

    }
  })


}


module.exports = getNumOfRel
