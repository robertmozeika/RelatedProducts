var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
const verifyHMAC = require('../custom_modules/verifyHMAC.js');


/* GET home page. */
router.post('/', function(req, res, next) {
  if (verifyHMAC(req.headers.referer,true)){
      var shop_session = req.session.shop;
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
        var empty = []
        resolve(empty)


        })
      };


      function replaceNum(arr){
        new Promise((resolve, reject)=>{
          if (resolve){
            var MongoClient = mongodb.MongoClient;

            var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
            MongoClient.connect(url, function(err, db){
              if(err){
                console.log('Unable to connect at replaceNum' + err);
                reject(err)
              } else {
                console.log('Connection between Database Success');
                var collection = db.collection("StoreProducts");
                productIDs.forEach((element, ind)=>{

                  collection.update({"productID" : element, "store":shop_session}, {$set:{"numOfRel" : Number(prodValues[ind])}}, function(result, err){
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
        res.redirect('/finish_auth?shop=' + shop_session)
      }).catch((err) =>{
        console.log("error at changenum promises")
        console.log(err)
      })
  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }

})

module.exports = router;
