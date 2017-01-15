var mongodb = require('mongodb');
const rpModel = require('../models/relatedProducts.js')
const spModel = require('../models/storeProducts.js')


function getRelatedProducts(inp, shop){
  return new Promise(function(resolve, reject){
     rpModel.find({"store":shop}).sort('order')
      .then(function(result){
          console.log('$$',result)
         var rpPass = {};
         if (result !== undefined){
          console.log("connection successful at getRel")
          result.forEach((element)=>{
            if (rpPass[element.forProduct]){
              rpPass[element.forProduct].push(element.title)

            }
            else {
              rpPass[element.forProduct] = [element.title];
            }

          })

          inp.forEach((ele)=>{
            ele.relatedProducts = rpPass[ele.productID];
          })
          resolve(rpPass);



         }
       else {
         console.log('passing nothing at getRel');

         var passPromise = [res, []]

         resolve(passPromise)

       }


     }).catch(function(err){
       console.log('Err at getRelatedProducts in getNumOfRel.js',err);
     })

});

}

function getNumOfRel(res, shop){
  return new Promise(function(resolve, reject){
 // var MongoClient = mongodb.MongoClient;
 //
 // var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
 // MongoClient.connect(url, function(err, db){
 //   if(err){
 //     console.log('Unable to connect' + err)
 //   } else {
 //     console.log('Connection between Database Success');
 //
 //     var collection = db.collection("StoreProducts");

     spModel.find({"store":shop})
      .then((result)=>{
         if (result !== undefined){
           console.log('##',result)
          getRelatedProducts(result, shop).then(function(inp){
            var passPromise = [res, result, inp, shop]

            resolve(passPromise)
          })


         }
       else {
         console.log('passing nothing at getNumRel')
         var passPromise = [res, []]

         resolve(passPromise)

       }


     }).catch(err=>{
       console.log('Err at getNumOfRel in getNumOfRel.js',err);
     });//

 //   }
 // })
});

}


module.exports = getNumOfRel
