var mongodb = require('mongodb')

function prodFromShopify(values){
return new Promise(function(resolve, reject){
// console.log("values here");
// console.log(JSON.parse(values[1])[0].id)
// console.log(values[0][1])
// values[0][1].forEach((currentDb) => {
//     var cDB = currentDb.substring(0, currentDb.length - 1);
//     JSON.parse(values[1]).forEach((shopProd) => {
//       if (shopProd.id == cDB){
//         console.log("match")
//       }
//     })
// })


// var numOfArr = [];
// var MongoClient = mongodb.MongoClient;
//
//  var url = "mongodb://localhost:27017/shopify"
//  MongoClient.connect(url, function(err, db){
//    if(err){
//      console.log('Unable to connect' + err)
//    } else {
//      console.log('Connection between Database Success');
//
//      var collection = db.collection('shops');
//
//      collection.find({"name" : "test-store-1994-1994"}).toArray(function(err, result){
//        console.log("lookhere")
//        console.log(result[0].products)
//
//        if(err) {
//
//        }else if (result.length){
//
//          result[0].products.forEach(function(element){
//            var str1 = element.numOfRel.toString();
//            var push1 = element.productID.concat(str1);
//            numOfArr.push(push1);
//          })
//
//          var passPromise = [res, numOfArr]
//
//          resolve(passPromise)
//         //  ShopifyObj.readAllProducts(res, numOfArr);
//
//        }
//      else {}
//
//      db.close();
//
//    });
//
//    }
//  })



 });

}
module.exports = prodFromShopify;
