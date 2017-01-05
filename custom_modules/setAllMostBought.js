var mongodb = require('mongodb');
var shopModel = require('../models/shops.js');
var abModel = require('../models/alsoBoughtProducts.js')


function setAlsoBought(whichMostBought,shop_session,abProds){

  return new Promise((resolve, reject)=> {



      var query = {
        name: shop_session,
      }
      var newData = {
        allMostBought: whichMostBought,
      }
      //changes the shops collection to the proper array of what was chosen from check boxes
      shopModel.findOneAndUpdate(query, newData, {upsert:false}, function(err, doc){
          if (err) {console.log(err);}
          else {console.log("succesfully updated most bought in shops collection")}
      });


      var MongoClient = mongodb.MongoClient;

      var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
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
              if (abProds){
                resolve(abProds)
              } else

                abModel.find({"forStore":shop_session})
                  .then(function(doc){

                    resolve(doc)
                  })


            })
          }

          function compareMatches(values){
            return new Promise((resolve,reject)=>{
                var leftovers = values[1];
                var leftOversToReplace = [];
                var mostBoughtOrdered = {};
                for (var i = 0; i < whichMostBought.length; i++){
                  mostBoughtOrdered[i+1] = {};

                    // console.log("leftovers")
                    // console.log(leftovers)
                    // console.log("leftovers over")

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

                // console.log(mostBoughtOrdered)






                var finder = [];
                var setter = [];



                /*which most ordered is a array of objects looking like:  ('1' is the first most ordered for each product that has also boughts)
                { '1':
                 { '6560603013':
                    { _id: 585beda36abc0d037d74ad0b,
                      forStore: 'test-store-1994-1994',
                      forProduct: '6560603013',
                      productID: '6744174917',
                      title: 'Fig Newton',
                      image: 'none',
                      howMany: 3 },
                   '6744174917':
                    { _id: 585beda36abc0d037d74ad0e,
                      forStore: 'test-store-1994-1994',
                      forProduct: '6744174917',
                      productID: '6560603013',
                      title: 'Dog',
                      image: 'https://cdn.shopify.com/s/files/1/1569/4167/products/imagejpeg_0_5_medium.jpg?v=1477581093',
                      howMany: 3 }, */
                // console.log('$$')
                // console.log(mostBoughtOrdered)
                var propertyNumber = 0;
                for (var i = 0; i < Object.keys(mostBoughtOrdered).length; i++){
                  if (whichMostBought[i]){
                    propertyNumber++;
                    // console.log('prop num');
                    // console.log(propertyNumber)
                    for (var propertyName in mostBoughtOrdered[i+1]){

                      finder.push({
                        forStore: shop_session,
                        forProduct: propertyName,
                        order: i,
                      });
                      setter.push({
                        productID: mostBoughtOrdered[propertyNumber][propertyName].productID,
                        title: mostBoughtOrdered[propertyNumber][propertyName].title,
                        image: mostBoughtOrdered[propertyNumber][propertyName].image,
                      })
                    }
                  }

                }







                var MongoClient = mongodb.MongoClient;

                var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
                MongoClient.connect(url, function(err, db){
                  var indexEval = []
                  if(err){
                    console.log("error at connection setDefault4All")
                    console.log('Unable to connect ' + err);
                    reject(err)
                  } else {

                      var collection = db.collection('RelatedProducts');

                      for (var i = 0; i < finder.length; i++){


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
                  var resolver = {
                    finder: finder,
                    setter: setter,
                  }
                  resolve(resolver);
              }
            })
        })
      }


          Promise.all([
            findRP(),
            findBP()
          ]).then((values)=>{
            return compareMatches(values);
          }).then(function(resolver){
            resolve(resolver);
          })


          db.close();

            }
          });

    })
}

module.exports = setAlsoBought;
