var mongodb = require('mongodb');
var index = require('../routes/index.js');


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

     var collectStr = index.shop_id + "StoreProducts"
     var collection = db.collection(index.colName);

     collection.find({}).toArray(function(err, result){
       if(err) {

        console.log(err)
      }else if (result !== undefined){
        console.log(result)
        console.log("connection successful at getNumOfRel")
         result.forEach(function(element){
           var str1 = element.numOfRel.toString();
           var push1 = element.productID.concat(str1);
           numOfArr.push(push1);
         })

         var passPromise = [res, numOfArr]

         resolve(passPromise)

       }
     else {
       console.log('passing nothing at getNumRel')
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
