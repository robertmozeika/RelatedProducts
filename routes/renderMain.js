var ShopifyObj = require('./shopify.js');

var mongodb = require('mongodb');
var index = require('./index.js');
var express = require('express');
var fs = require('fs');



 function getNumOfRel(res){
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


}


module.exports = getNumOfRel
