var mongodb = require('mongodb');
var index = require('../routes/index.js')

function prodFromShopify(values){
return new Promise(function(resolve, reject){
// console.log("values here");
// console.log(JSON.parse(values[1])[0].id)
// console.log(values[0][1])
// if (values[0][1] !== undefined){
//   console.log('attempting')
//   console.log(values[0][1])
//   values[0][1].forEach(function(currentDb) {
//     console.log("currentDB")
//     console.log(currentDb)
//       var cDB = currentDb.substring(0, currentDb.length - 1);
//       JSON.parse(values[1]).forEach((shopProd) => {
//         if (shopProd.id == cDB){
//           console.log("match")
//         }
//       })
//   })
// }

    var products2Add = []
    if (values[0][1] !== undefined){

      console.log('attempting')
      console.log(values[0][1])
      JSON.parse(values[1]).forEach((shopProd) => {
          var need2add = true;
          values[0][1].forEach((currentDb) => {
            var cDB = currentDb.substring(0, currentDb.length - 1);
            if (shopProd.id == cDB){
              console.log('matchedit')
              need2add = false;
              return
            }
          })
          console.log("need2add is " + need2add)
          if (need2add == true){
            products2Add.push(shopProd)
          }
      });
      console.log("after is array")
      console.log(products2Add)
    }


    var numOfArr = [];
    var MongoClient = mongodb.MongoClient;

     var url = "mongodb://localhost:27017/shopify"
     MongoClient.connect(url, function(err, db){
       if(err){
         console.log('Unable to connect' + err)
       } else {
         console.log('Connection between Database Success');

         var collection = db.collection('shops');

         var errors = [];
         products2Add.forEach((element) => {
           collection.update({"name": index.shop_id}, {$push:{"products": {"productID" : element.id.toString(), "numOfRel": 3}}},  function(err, result){
             if (err) {
              errors.push(err);
               console.log(" we got an error ");
               console.log(err)
             }
             else {
               console.log("inserted into document")
             }

         });
       })
       if (errors.length > 0 ){
         reject(errors)
       }
       else {
         resolve(true)
       }
       db.close();

       }
     })



 });

}
module.exports = prodFromShopify;
