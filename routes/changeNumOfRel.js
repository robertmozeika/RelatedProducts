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
  console.log(productIDs);
  var prodValues = Object.values(req.body);
  console.log( typeof productIDs[0])
  var ready4DB = []
  for (var i = 0; i < productIDs.length ;i++){
    ready4DB.push({id : productIDs[i], num : Number(prodValues[i])})
  }

  console.log(ready4DB)




function getArrayIndexes(){
  return new Promise((resolve, reject)=> {
      var MongoClient = mongodb.MongoClient;

      var url = "mongodb://localhost:27017/shopify"
      MongoClient.connect(url, function(err, db){
        var indexEval = []
        if(err){
          console.log('Unable to connect' + err);
          reject(err)
        } else {
          console.log('Connection between Database Success');

          var collection = db.collection('shops');
          collection.find({"name" : index.shop_id, "products.productID" : {$exists: true}}, {"products": 1, "_id": 0}).toArray(function(err, result){
            if (err){
              console.log("Error getting productsID " + err)
            }
            else {

              // console.log(result[0].products);
              result[0].products.forEach((element) => {
                indexEval.push(element.productID)
              })
              resolve(indexEval)
              ready4DB.forEach((element)=>{
                var curIndex = indexEval.indexOf(element.id)
                var productInsert = "products."+curIndex+".numOfRel"
                collection.update({"name" : "test-store-1994-1994"}, {$set:{productInsert : 6}})




              })
            }
          })

        //   var errors = [];
        //   ready4DB.forEach((element) => {
        //     collection.update({"name": index.shop_id, "productID": element.id}, {$set:{""}},  function(err, result){
        //       if (err) {
        //        errors.push(err);
        //         console.log(" we got an error ");
        //         console.log(err)
        //       }
        //       else {
        //         console.log("inserted into document")
        //       }
        //
        //   });
        // })

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
            console.log('Unable to connect' + err);
            reject(err)
          } else {
            console.log('Connection between Database Success');

            var collection = db.collection('shops');
            ready4DB.forEach((element)=>{
              console.log(element.id)
              var curIndex = arr.indexOf(element.id)
              var productInsert = "products."+curIndex+".numOfRel"
              var updater = {};
              updater[productInsert] = element.num;
              console.log(updater)
              collection.update({"name" : "test-store-1994-1994"}, {$set:updater}, function(result, err){
                if (err){
                  console.log("error at update")
                  console.log(err)
                  reject(err)
                }
                else {
                  console.log('successful update')
                }
              })




            })


          //   var errors = [];
          //   ready4DB.forEach((element) => {
          //     collection.update({"name": index.shop_id, "productID": element.id}, {$set:{""}},  function(err, result){
          //       if (err) {
          //        errors.push(err);
          //         console.log(" we got an error ");
          //         console.log(err)
          //       }
          //       else {
          //         console.log("inserted into document")
          //       }
          //
          //   });
          // })

          db.close();

              }
            })
      } else {
        console.log("got error at replaceNum");
        reject(err)
      }




    })

  }
  var promise = getArrayIndexes();
  promise.then((inp)=>{
    console.log('here is inp')
    return replaceNum(inp)
}).then(()=>{
  res.redirect('/finish_auth')
}).catch((err) =>{
  console.log(err)
})


})

module.exports = router;
