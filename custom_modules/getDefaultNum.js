var mongodb = require('mongodb');

function getDefault(shop){
  return new Promise(function(resolve, reject){
  var numOfArr = [];
 var MongoClient = mongodb.MongoClient;

 var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
 MongoClient.connect(url, function(err, db){
   if(err){
     console.log('Unable to connect' + err)
   } else {
     console.log('Connection between Database Success');

     var collection = db.collection('shops');

     collection.find({"name": shop}).toArray(function(err, result){
       if(err) {

        console.log(err)
      }else if (result !== undefined){
         var defaultNum = result[0].defaultNumOfRelated;
         var allMostBought = result[0].allMostBought;
         var header = result[0].header;
         var defNumPass = {
           defaultNum: defaultNum,
           allMostBought: allMostBought,
           header: header,
         }

         resolve(defNumPass)

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
