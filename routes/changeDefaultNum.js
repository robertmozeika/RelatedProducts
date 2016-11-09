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
                resolve();

              }
            });


            db.close();

              }
            })
      })
    };


    function setDefault4All(){
      return new Promise((resolve, reject)=> {
        if (changeAll){
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

              var collection = db.collection(index.colName);

                collection.update({"productID" : {$exists: true}}, {$set:{"numOfRel" : defNum}}, {multi: true}, function(err, result){
                  console.log("update function ran $$")
                  if (err){
                    console.log("got error updating defnum")
                    console.log(err);
                    reject(err);
                  } else {
                    resolve(); }
              })


              db.close();

                }
              });
          }
          else {
            resolve();
          }
        })
      };






    var promise = setDefaultNum();
    promise.then(()=>{
      return setDefault4All();
    }).then(function(){
      res.redirect('/finish_auth');
    }).catch((err) =>{
      console.log("error at changeDefNum")
      console.log(err)
    })

});


module.exports = router



// {"name" : {$exists: {$exists: true}}}
