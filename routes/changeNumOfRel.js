var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var index = require('./index.js')

/* GET home page. */
router.post('/', function(req, res, next) {
  var propNames = Object.getOwnPropertyNames(req.body);
  var productIDs = [];
  propNames.forEach((element) => {
    var toPush = element.substring(8);
    productIDs.push(toPush);
  })
  var prodValues = Object.values(req.body);
  var ready4DB = []
  for (var i = 0; i < productIDs.length ;i++){
    ready4DB.push({id : productIDs[i], num : Number(prodValues[i])})
  }





function getArrayIndexes(){
  return new Promise((resolve, reject)=> {
      var MongoClient = mongodb.MongoClient;

      var url = "mongodb://localhost:27017/shopify"
      MongoClient.connect(url, function(err, db){
        var indexEval = []
        if(err){
          console.log("error at connection getArrayIndexes")
          console.log('Unable to connect ' + err);
          reject(err)
        } else {
          console.log('Connection between Database Success');

          var collection = db.collection('shops');
          console.log("find for " + index.shop_id)
          collection.find({"name" : index.shop_id, "products.productID" : {$exists: true}}, {"products": 1, "_id": 0}).toArray(function(err, result){
            if (err){
              console.log("Error getting productsID " + err)
            }
            else {
              console.log("success finding connection at getArrayIndexes")
              console.log(result)
              result[0].products.forEach((element) => {
                indexEval.push(element.productID)
              })
              resolve(indexEval)

            }
          })


        db.close();

            }
          })
    })
  };


  function replaceNum(arr){
    new Promise((resolve, reject)=>{
      if (resolve){
        var MongoClient = mongodb.MongoClient;

        var url = "mongodb://localhost:27017/shopify"
        MongoClient.connect(url, function(err, db){
          if(err){
            console.log('Unable to connect at replaceNum' + err);
            reject(err)
          } else {
            console.log('Connection between Database Success');

            var collection = db.collection('shops');
            ready4DB.forEach((element)=>{
              var curIndex = arr.indexOf(element.id)
              var productInsert = "products."+curIndex+".numOfRel"
              var updater = {};
              updater[productInsert] = element.num;
              collection.update({"name" : "test-store-1994-1994"}, {$set:updater}, function(result, err){
                if (err){
                  console.log("error at update replaceNum" )
                  console.log(err)
                  reject(err)
                }
                else {
                  console.log('successful update')
                }
              })




            })


          db.close();

              }
            })
      }

    })

  }
  var promise = getArrayIndexes();
  promise.then((inp)=>{
    console.log("here is inp")
    return replaceNum(inp)
  }).then(()=>{
    res.redirect('/finish_auth')
  }).catch((err) =>{
    console.log("error at changenum promises")
    console.log(err)
  })


})

module.exports = router;
