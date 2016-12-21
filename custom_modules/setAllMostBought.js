var mongodb = require('mongodb');

function setAlsoBought(whichMostBought,shop_session){

  return new Promise((resolve, reject)=> {
      var MongoClient = mongodb.MongoClient;

      var url = "mongodb://localhost:27017/shopify"
      MongoClient.connect(url, function(err, db){
        var indexEval = []
        if(err){
          console.log("error at connection setDefault4All")
          console.log('Unable to connect ' + err);
          reject(err)
        } else {
          console.log('Connection between Database Success at setDefault4All');

          function findRP(){
            return new Promise((resolve, reject)=>{
              var collection = db.collection("RelatedProducts");
                console.log(whichMostBought)
                collection.find({"order":{$in:whichMostBought} , "forStore":shop_session}).toArray(function(err, result){
                  if (err){
                    console.log(err);
                    reject(err);
                  } else {
                    resolve(result);
                  }
              })
            })
          }

          function findBP(){
            return new Promise((resolve, reject)=>{
              var collection = db.collection("alsoBoughtProducts");

                collection.find({"forStore":shop_session}).toArray(function(err, result){
                  if (err){
                    console.log(err);
                    reject(err);
                  } else {
                    resolve(result);
                  }
              })
            })
          }

          function compareMatches(values){

            var leftovers = values[1];
            var leftOversToReplace = [];
            var mostBoughtOrdered = {};
            for (var i = 0; i < whichMostBought.length; i++){
              mostBoughtOrdered[i+1] = {};

                console.log("leftovers")
                console.log(leftovers)
                console.log("leftovers over")

              leftovers.forEach((element)=>{
                if(mostBoughtOrdered[i+1][element.forProduct]){

                  if (element.howMany > mostBoughtOrdered[i+1][element.forProduct]["howMany"]){
                    leftOversToReplace.push(mostBoughtOrdered[i+1][element.forProduct])
                    mostBoughtOrdered[i+1][element.forProduct] = element;
                  } else {
                    leftOversToReplace.push(element)
                  }


                } else{
                  mostBoughtOrdered[i+1][element.forProduct] = element;
                }
              })
              leftovers = leftOversToReplace;
              leftOversToReplace = [];

            }

            console.log(mostBoughtOrdered)






            var finder = [];
            var setter = [];
            console.log("%%");




            var propertyNumber = 0;
            for (var i = 0; i < Object.keys(mostBoughtOrdered).length; i++){
              if (whichMostBought[i]){
                propertyNumber++;
                console.log('prop num');
                console.log(propertyNumber)
                for (var propertyName in mostBoughtOrdered[i+1]){

                  finder.push({
                    forStore: shop_session,
                    forProduct: propertyName,
                    order: i+1,
                  });
                  setter.push({
                    productID: mostBoughtOrdered[propertyNumber][propertyName].productID,
                    title: mostBoughtOrdered[propertyNumber][propertyName].title,
                    image: mostBoughtOrdered[propertyNumber][propertyName].image,
                  })
                }
              }

            }






            console.log(finder);
            console.log(setter)
            var MongoClient = mongodb.MongoClient;

            var url = "mongodb://localhost:27017/shopify"
            MongoClient.connect(url, function(err, db){
              var indexEval = []
              if(err){
                console.log("error at connection setDefault4All")
                console.log('Unable to connect ' + err);
                reject(err)
              } else {

                  var collection = db.collection('RelatedProducts');

                  for (var i = 0; i < finder.length; i++){
                    console.log(finder[i])
                    console.log(setter[i])

                    collection.update(finder[i], {$set: setter[i]}, function(err, result){
                        if (err){
                          console.log("error at set alsobought");
                          reject(err);
                        } else {
                          console.log("$updated")

                          // if(i == finder.length - 1){
                          //   resolve();
                          // }
                        }
                    })
                  }
              db.close();
          }
        })}


          Promise.all([
            findRP(),
            findBP()
          ]).then((values)=>{
            compareMatches(values);
            resolve();
          })


          db.close();

            }
          });

    })
}

module.exports = setAlsoBought;
