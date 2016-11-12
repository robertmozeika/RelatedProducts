var mongodb = require('mongodb');
var index = require('../routes/index.js');

function getRelatedProducts(inp){
  return new Promise(function(resolve, reject){
 var MongoClient = mongodb.MongoClient;

 var url = "mongodb://localhost:27017/shopify"
 MongoClient.connect(url, function(err, db){
   if(err){
     console.log('Unable to connect' + err)
   } else {
     console.log('Connection between Database Success');

     var collection = db.collection('RelatedProducts');
     collection.find({"forStore":index.shop_id}).toArray(function(err, result){
       var rpPass = {};
       if(err) {

        console.log(err)
      }else if (result !== undefined){
        console.log("connection successful at getRel")
        result.forEach((element)=>{
          if (rpPass[element.forProduct]){
            rpPass[element.forProduct].push(element.title)

          }
          else {
            rpPass[element.forProduct] = [element.title];
          }

        })
        console.log('rpPas')
        console.log(rpPass);
        resolve(rpPass);



       }
     else {
       console.log('passing nothing at getRel')
       var passPromise = [res, []]

       resolve(passPromise)

     }

     db.close();

   });

   }
 })
});

}

function getNumOfRel(res){
  return new Promise(function(resolve, reject){
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
        console.log("connection successful at getNumOfRel")
        getRelatedProducts(result).then(function(inp){
          var passPromise = [res, result, inp, index.shop_id]

          resolve(passPromise)
        })


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
