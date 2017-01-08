var mongodb = require('mongodb');

function getRelatedProducts(inp, shop){
  return new Promise(function(resolve, reject){
 var MongoClient = mongodb.MongoClient;

 var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
 MongoClient.connect(url, function(err, db){
   if(err){
     console.log('Unable to connect' + err)
   } else {
     console.log('Connection between Database Success');

     var collection = db.collection('RelatedProducts');
     collection.find({"store":shop},{"sort": "order"}).toArray(function(err, result){
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

     db.close();

   });

   }
 })
});

}

function getNumOfRel(res, shop){
  return new Promise(function(resolve, reject){
 var MongoClient = mongodb.MongoClient;

 var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
 MongoClient.connect(url, function(err, db){
   if(err){
     console.log('Unable to connect' + err)
   } else {
     console.log('Connection between Database Success');

     var collection = db.collection("StoreProducts");

     collection.find({"store":shop}).toArray(function(err, result){
       if(err) {

        console.log(err)
      }else if (result !== undefined){
        console.log("connection successful at getNumOfRel")
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

     db.close();

   });

   }
 })
});

}


module.exports = getNumOfRel
