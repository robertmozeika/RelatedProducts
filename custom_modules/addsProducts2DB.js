var mongodb = require('mongodb');
var index = require('../routes/index.js')
var getNumOfRel = require('./getNumOfRel.js');

function prodFromShopify(values){
return new Promise(function(resolve, reject){

    var products2Add = []
    if (values[0][1] !== undefined){


      JSON.parse(values[1]).forEach((shopProd) => {
          var need2add = true;
          values[0][1].forEach((currentDb) => {
            // var cDB = currentDb.substring(0, currentDb.length - 1);
            if (shopProd.id == currentDb.productID){
              need2add = false;
              return
            }
          })
          if (need2add == true){
            products2Add.push(shopProd)
          }
      });

    }


    if (products2Add.length > 0){
      console.log('Adding new products to DB');
      var numOfArr = [];
      var MongoClient = mongodb.MongoClient;

       var url = "mongodb://localhost:27017/shopify"
       MongoClient.connect(url, function(err, db){
         if(err){
           console.log('Unable to connect' + err)
         } else {
           console.log('Connection between Database Success at addProducts2Database');

           var collectStr = index.shop_id + "StoreProducts"
           var collection = db.collection(index.colName);

           var errors = [];
           products2Add.forEach((element) => {
             collection.insert({"productID" : element.id.toString(), "productName": element.title, "numOfRel": values[2]},  function(err, result){
               if (err) {
                errors.push(err);
                 console.log(" we got an error at addProducts2DB ");
                 console.log(err)
               }
               else {
                 console.log("inserted into document");
                 getNumOfRel(values[0][0]).then(function(inp){

                   resolve([inp,values[2]])
                 })


               }

           });
         })

         db.close();

         }
       })
   }
   else {
     resolve([values[0],values[2]])
   }


 });

}
module.exports = prodFromShopify;
