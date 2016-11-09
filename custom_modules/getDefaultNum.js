var mongodb = require('mongodb');
var index = require('../routes/index.js');

function getDefault(){
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

     collection.find({"name": index.shop_id}).toArray(function(err, result){
       if(err) {

        console.log(err)
      }else if (result !== undefined){
         var defaultNum = result[0].defaultNumOfRelated;
         console.log("defaultnum")
         console.log(defaultNum)
         resolve(defaultNum)

       }
     else {
       console.log('passing nothing at getNumRel')

       resolve(3)

     }

     db.close();

   });

   }
 })
});

}


module.exports = getDefault;
