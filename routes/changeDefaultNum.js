var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var index = require('./index.js')




router.get('/', function(req, res, next) {
  var defNum = Number(req.query.defNum);
  var changeAll = req.query.changeAll

  function setDefaultNum(){
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
            collection.update({"name" : index.shop_id}, {$set:{"defaultNumOfRelated": defNum}}, function(err, result){
              if (err){
                console.log("Error getting productsID " + err);
                reject(err)
              }
              else {
                console.log("Updated default num of related successfully");


              }
            });
            if (changeAll){
              collection.find({"name" : "test-store-1994-1994"}, {"products": 1}).toArray(function(err, result){
                if (err){
                  console.log(err);
                  reject(err);
                } else {
                  console.log("look2here")
                  console.log(result[0].products)
                  resolve();
                }
              })
            }

            if (changeAll){

            }


            db.close();

              }
            })
      })
    };


    function setDefault4All(){
      return new Promise((resolve, reject)=> {
          var MongoClient = mongodb.MongoClient;

          var url = "mongodb://localhost:27017/shopify"
          MongoClient.connect(url, function(err, db){
            var indexEval = []
            if(err){
              console.log("error at connection setDefault4All")
              console.log('Unable to connect ' + err);
              reject(err)
            } else {
              console.log('Connection between Database Success at setDefault4All');

              var collection = db.collection('shops');

              if (changeAll){
                collection.find({"name" : "test-store-1994-1994"}).toArray(function(err, result){
                  if (err){
                    console.log(err);
                    reject(err);
                  } else {
                    console.log("look1here")
                  console.log(result)
                resolve(); }
                })
              }

              db.close();

                }
              });

        })
      };






    var promise = setDefaultNum();
    promise.then((inp)=>{
      return setDefault4All();
    }).then(function(){
      res.redirect('/finish_auth');
    }).catch((err) =>{
      console.log("error at changenum promises")
      console.log(err)
    })

});


module.exports = router
