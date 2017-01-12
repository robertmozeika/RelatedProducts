var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const verifyHMAC = require('../custom_modules/verifyHMAC.js');



router.get('/', function(req, res, next) {
  if (verifyHMAC(req.headers.referer,true)){
    var shop_session = req.session.shop;
    var defNum = Number(req.query.defNum);
    var changeAll = req.query.changeAll;
    var oldNum = Number(req.query.old);

    var { toMostBought1,toMostBought2,toMostBought3,toMostBought4,toMostBought5,toMostBought6 } = req.query;
    console.log(toMostBought6)
    var toMostBought = [req.query.toMostBought1,req.query.toMostBought2,req.query.toMostBought3,req.query.toMostBought4,req.query.toMostBought5,req.query.toMostBought6];
    var whichMostBought = [];
    toMostBought.forEach((element, index)=>{
      if (element !== undefined){
        whichMostBought.push(index + 1)
      }
    })


    function setDefaultNum(){
      return new Promise((resolve, reject)=> {
          var MongoClient = mongodb.MongoClient;

          var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
          MongoClient.connect(url, function(err, db){
            var indexEval = []
            if(err){
              console.log("error at connection getArrayIndexes")
              console.log('Unable to connect ' + err);
              reject(err)
            } else {
              console.log('Connection between Database Success');
              var rpCollection = db.collection('RelatedProducts');

              if (changeAll){



            }
              var collection = db.collection('shops');
              collection.update({"name" : shop_session}, {$set:{"defaultNumOfRelated": defNum}}, function(err, result){
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


      function insertBlanks(ins){
        var MongoClient = mongodb.MongoClient;

        var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
        MongoClient.connect(url, function(err, db){
          if(err){
            console.log('Unable to connect' + err)
          } else {
            console.log('Connection between Database Success at connectDB');

            var collection = db.collection('RelatedProducts');

            collection.insert(ins, function(err, result){
              if (err){
                console.log(err)
              } else {
                console.log('rps were added ')
              }
              db.close();
            });

          }
          });
        }





      function setDefault4All(){
        return new Promise((resolve, reject)=> {
          if (changeAll){
            var MongoClient = mongodb.MongoClient;

            var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
            MongoClient.connect(url, function(err, db){
              var indexEval = []
              if(err){
                console.log("error at connection setDefault4All")
                console.log('Unable to connect ' + err);
                reject(err)
              } else {
                console.log('Connection between Database Success at setDefault4All');

                var collection = db.collection("StoreProducts");

                  collection.update({"productID" : {$exists: true}, "store":shop_session}, {$set:{"numOfRel" : defNum}}, {multi: true}, function(err, result){
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




        function setAlsoBought(){

          return new Promise((resolve, reject)=> {
            if (whichMostBought.length > 0){
              var MongoClient = mongodb.MongoClient;

              var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
              MongoClient.connect(url, function(err, db){
                var indexEval = []
                if(err){
                  console.log("error at connection setDefault4All")
                  console.log('Unable to connect ' + err);
                  reject(err)
                } else {
                  console.log('Connection between Database Success at setDefault4All');

                  function findRP(){
                    return new Promise((resolve, reject)=>{
                      var collection = db.collection("RelatedProducts");

                        collection.find({"order":{$in:whichMostBought} , "store":shop_session}).toArray(function(err, result){
                          if (err){
                            console.log(err);
                            reject(err);
                          } else {
                            resolve(result);
                          }
                      })
                    })
                  }

                  function findBP(){
                    return new Promise((resolve, reject)=>{
                      var collection = db.collection("alsoBoughtProducts");

                        collection.find({"store":shop_session}).toArray(function(err, result){
                          if (err){
                            console.log(err);
                            reject(err);
                          } else {
                            resolve(result);
                          }
                      })
                    })
                  }

                  function compareMatches(values){

                    var leftovers = values[1];
                    var leftOversToReplace = [];
                    var mostBoughtOrdered = {};
                    for (var i = 0; i < whichMostBought.length; i++){
                      mostBoughtOrdered[i+1] = {};

                        console.log("leftovers")
                        console.log(leftovers)
                        console.log("leftovers over")

                      leftovers.forEach((element)=>{
                        if(mostBoughtOrdered[i+1][element.forProduct]){
                          if(element.forProduct == "6560603013"){
                            console.log('found one')
                          }
                          if (element.howMany > mostBoughtOrdered[i+1][element.forProduct]["howMany"]){
                            leftOversToReplace.push(mostBoughtOrdered[i+1][element.forProduct])
                            mostBoughtOrdered[i+1][element.forProduct] = element;
                          } else {
                            leftOversToReplace.push(element)
                          }
                          if(element.forProduct == "6560603013"){

                          }

                        } else{
                          mostBoughtOrdered[i+1][element.forProduct] = element;
                        }
                      })
                      leftovers = leftOversToReplace;
                      leftOversToReplace = [];

                    }

                    console.log(mostBoughtOrdered)






                    var finder = [];
                    var setter = [];
                    console.log("%%");

                    for (var i = 0; i < Object.keys(mostBoughtOrdered).length; i++){
                      for (var propertyName in mostBoughtOrdered[i+1]){

                        finder.push({
                          store: shop_session,
                          forProduct: propertyName,
                          order: i+1,
                        });
                        setter.push({
                          productID: mostBoughtOrdered[i+1][propertyName].productID,
                          title: mostBoughtOrdered[i+1][propertyName].title,
                          image: mostBoughtOrdered[i+1][propertyName].image,
                        })
                      }
                    }

                    console.log(finder);
                    console.log(setter)
                    var MongoClient = mongodb.MongoClient;

                    var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
                    MongoClient.connect(url, function(err, db){
                      var indexEval = []
                      if(err){
                        console.log("error at connection setDefault4All")
                        console.log('Unable to connect ' + err);
                        reject(err)
                      } else {

                          var collection = db.collection('RelatedProducts');

                          for (var i = 0; i < finder.length; i++){
                            console.log(finder[i])
                            console.log(setter[i])

                            collection.update(finder[i], {$set: setter[i]}, function(err, result){
                                if (err){
                                  console.log("error at set alsobought");
                                  reject(err);
                                } else {
                                  console.log("$updated")

                                  // if(i == finder.length - 1){
                                  //   resolve();
                                  // }
                                }
                            })
                          }
                      db.close();
                  }
                })}


                  Promise.all([
                    findRP(),
                    findBP()
                  ]).then((values)=>{
                    compareMatches(values);
                    resolve();
                  })


                  db.close();

                    }
                  });
              }
              else {
                resolve();
              }
            })
        }







      Promise.all([
        setDefault4All(),
        setDefaultNum(),
        setAlsoBought()

      ]).then(function(){
        res.redirect('/finish_auth?shop=' + shop_session);
      }).catch((err) =>{
        console.log("error at changeDefNum")
        console.log(err)
      })

  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }

});


module.exports = router
