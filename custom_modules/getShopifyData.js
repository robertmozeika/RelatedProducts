var shopifyAPI = require('shopify-node-api');
var shopModel = require('../models/shops.js');

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


function prodFromShopify(shopifyconfig){
  return new Promise(function(resolve, reject){
    // if (resolve) {
      var shopify = new shopifyAPI(shopifyconfig)

      function getProducts(){
        return new Promise((resolve,reject)=>{
          shopify.get('/admin/products.json',  function(err, data, headers){
                  // var stringdata = JSON.stringify(data.products);
                        // resolve(JSON.parse(stringdata))
                        resolve(data.products)

                        if (err){
                          console.log("reject is " + err)
                          reject(err);
                        }
          });
        })
      }

      function getCollects(){
        return new Promise((resolve,reject)=>{
          shopify.get('/admin/collects.json', function(err, data, headers){
            // console.log(data)
                  // var stringdata = JSON.stringify(data.products);
                  console.log(data)
                        resolve(data.collects)

                        if (err){
                          console.log("reject is " + err)
                          reject(err);
                        }
          });
        })
      }

      function getCustomCollections(){
        return new Promise((resolve,reject)=>{
          shopify.get('/admin/custom_collections.json', function(err, data, headers){
            // console.log(data)
                  // var stringdata = JSON.stringify(data.products);
                        resolve(data.custom_collections)

                        if (err){
                          console.log("reject is " + err)
                          reject(err);
                        }
          });
        })
      }

      function getSmartCollections(){
        return new Promise((resolve,reject)=>{
          shopify.get('/admin/smart_collections.json', function(err, data, headers){
            // console.log(data)
                  // var stringdata = JSON.stringify(data.products);
                        resolve(data.smart_collections)

                        if (err){
                          console.log("reject is " + err)
                          reject(err);
                        }
          });
        })
      }

      Promise.all([
        getProducts(),
        getCustomCollections(),
        getSmartCollections(),
        getCollects(),

      ]).then(([ products, custom_collections, smart_collections, collects ])=>{
        var collectionMap = new Map();

        custom_collections.forEach((element)=>{
          collectionMap.set(element.id,element.title)
        })

        smart_collections.forEach((element)=>{
          collectionMap.set(element.id,element.title)
        })

        const collectionArray = [];
        collectionMap.forEach((val)=>{
        collectionArray.push({value: val, display: val})
        })
        console.log('$',collectionArray);


        collects.forEach((collect)=>{
          var idx = findWithAttr(products,'id',collect.product_id);
          console.log(collect.collection_id,collectionMap.get(collect.collection_id),collectionMap)
          if (products[idx].collections){
            products[idx].collections.push(collectionMap.get(collect.collection_id))
          } else {
            products[idx].collections = [collectionMap.get(collect.collection_id)]
            products[idx].collections = products[idx].collections.sort()
          }
        })


        // console.log('collections',collections);
        resolve([products,collectionArray])
      })

      // }



    });

}
module.exports = prodFromShopify;
