var ShopifyObj = require('./shopify.js');

var mongodb = require('mongodb');
var index = require('../routes/index.js');
var express = require('express');
var fs = require('fs');
var getShop = require('./getShopifyData.js');


function getNumOfRel(res){
  return new Promise(function(resolve, reject){
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
       console.log(result)
       if(err) {
        console.log(err)
      }else if (result[0].products !== undefined){
        console.log('else if happened')
         result[0].products.forEach(function(element){
           var str1 = element.numOfRel.toString();
           var push1 = element.productID.concat(str1);
           numOfArr.push(push1);
         })

         var passPromise = [res, numOfArr]

         resolve(passPromise)
        //  ShopifyObj.readAllProducts(res, numOfArr);

       }
     else {
       console.log('passing nothing')
       var passPromise = [res, []]

       resolve(passPromise)

     }

     db.close();

   });

   }
 })
});

}


module.exports = getNumOfRel
