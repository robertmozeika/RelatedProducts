var mongodb = require('mongodb');
var getNumOfRel = require('./getNumOfRel.js');
var addAlsoBought = require('./addAlsoBought');
var assignNewAB = require('./assignNewProductAlsoBought')

function prodFromShopify(values, shop, shopify){
return new Promise(function(resolve, reject){
    var products2Add = [];
    //gets put into add alsobought function
    var ids2Add = [];
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

            products2Add.push(shopProd);

            var image;
            if (shopProd.image){

              image = shopProd.image.src
              var num = image.indexOf(".jpg");
              if (num == -1){
                num = image.indexOf(".png")
              }
              if (num > -1){
                image = [image.slice(0,num), "_medium", image.slice(num)].join('');
              }

            }
            else{
              image = "none"
            }

            ids2Add.push({id: shopProd.id, image: image})
          }
      });

    }

    var insert2RP =[];

    if (products2Add.length > 0){
        addAlsoBought(ids2Add, shopify)

        var insert2RP =[];
        products2Add.forEach((element)=>{

          for (var i = 1; i <= 6; i++){
            var insObj = {
              forStore: shop,
              forProduct: element.id.toString(),
              productID: "blank",
              title: "blank",
              order: i,
              image: "none"
            };
            insert2RP.push(insObj)
          }

        })
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

           var collection2 = db.collection('RelatedProducts');

           collection2.insert(insert2RP, function(err, result){
             if (err){
               console.log(err)
             } else {
               console.log('rps were added ')
             }
           });

           var collection = db.collection("StoreProducts");

           var errors = [];
           products2Add.forEach((element) => {
             var image;
             if (element.image){

               image = element.image.src
               var num = image.indexOf(".jpg");
               if (num == -1){
                 num = image.indexOf(".png")
               }
               if (num > -1){
                 image = [image.slice(0,num), "_medium", image.slice(num)].join('');
               }

             }
             else{
               image = "none"
             }

             var inserter = {
               "productID" : element.id.toString(),
               "title": element.title,
               "numOfRel": values[2].defaultNum,
               "store":shop,
               "image": image
             }

             completeInsert = [];
             completeInsert.push(inserter)
             values[0][1].push(inserter)
             collection.insert({"productID" : element.id.toString(), "title": element.title, "numOfRel": values[2].defaultNum, "store":shop, "image": image},  function(err, result){
               if (err) {
                errors.push(err);
                 console.log(" we got an error at addProducts2DB ");
                 console.log(err)
               }
               else {
                 console.log("inserted into document");

               }

           });



         })

         console.log('$$')
         console.log(completeInsert)
         console.log(values[2])
         //adds also bought from the defaultNum how many are set to also bought all and also adds a temporary property for related products as a property of the product object

         db.close();
         assignNewAB(completeInsert, values[2].allMostBought, shop).then(function(data){
           //add complete insert retuned to values[0][1] down here instead
           console.log(data)
           resolve([values[0],values[2]]);
         })

         }
        })
       }

       else {
         resolve([values[0],values[2]])
       }
    // }





 });

}
module.exports = prodFromShopify;
