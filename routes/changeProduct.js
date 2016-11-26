var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body)

  var shop_id = req.body.store;
  var forproduct = req.body.forProduct;


  var propNames = Object.getOwnPropertyNames(req.body);
//   var productIDs = [];
//   propNames.forEach((element) => {
//     var toPush = element.substring(8);
//     productIDs.push(toPush);
//   })
  var prodValues = Object.values(req.body);
// console.log("product ids next")
//   console.log(productIDs)
  var updateRP = [];
  var updatedRP = [];
  for (var i = 0; i < (propNames.length - 2); i++){
// {"forStore": shop_id, "forProduct": forproduct, "productID" : oldproduct, "order": order},{$set:{"productID": product, "title": title}}
    var uRP = {
      "forStore": shop_id,
      "order": Number(propNames[i].slice(0,1)),
      "forProduct": forproduct,
      "productID": propNames[i].slice(1)


    }
    
    var indexNum = prodValues[i].indexOf("https");
    if (indexNum > -1){
      image = prodValues[i].slice(indexNum)
    } else {
      image = "none";
      indexNum = prodValues[i].indexOf("none");
    }

    var dRP ={

      $set:{
        "productID": prodValues[i].slice(0,10),
        "title": prodValues[i].slice(10, indexNum),
        "image": image
      }
    }
    console.log("$$");
    console.log(dRP)


    updatedRP.push(dRP)
    updateRP.push(uRP)

  }
  console.log('updateRP next')
  console.log(updateRP)
  console.log(updatedRP)


  function updateProducts(){
    return new Promise((resolve, reject)=>{


        var MongoClient = mongodb.MongoClient;

        var url = "mongodb://localhost:27017/shopify"
        MongoClient.connect(url, function(err, db){
          if(err){
            console.log('Unable to connect' + err)
          } else {
            console.log('Connection between Database Success');


            var collection = db.collection('RelatedProducts');
            for (var i = 0; i < updateRP.length; i++){
              if (updatedRP[i].$set.productID !== ""){
                  console.log('trying to update')
                  var p = 0
                if (updateRP[i].productID !== "")
                  collection.update(updateRP[i],updatedRP[i], function(err, result){
                  if (err){
                    reject(err)
                  } else {
                    console.log("i is", i)
                    p += 1;
                    console.log(p)
                      // if (p == updateRP.length){
                      //   console.log('342323')
                      // resolve();}
                    }
                  });
              }
              if (i == (updateRP.length - 1)){
                console.log('next promise ')
                resolve();
              }
            }

          }
        })
    })
  }

  var promise = updateProducts();
  promise.then(function(){
    console.log("went to next promise")
    res.redirect('/finish_auth?shop=' + shop_id)

  }).catch((err)=>{
    console.log(err)
  })

});



module.exports = router;
