var mongodb = require('mongodb');
var getNumOfRel = require('./getNumOfRel.js');
var AddAlsoBought = require('./addAlsoBought');
var assignNewAB = require('./assignNewProductAlsoBought');
const spModel = require('../models/storeProducts.js')

function ProductInsert(product,image,defaultNum){
    this.productID  = product.id.toString();
    this.title = product.title;
    this.numOfRel = defaultNum;
    this.store = this.shop;
    this.image = image;
    this.price = product.variants[0].price;
    this.handle = product.handle;
    this.locks = [false,false,false,false,false,false];
    this._collections = product.collections;
}

class AddProducts2DB {
  constructor([ dbProducts, shopData, defaultNum ], shop, shopify){
    this.dbProducts = dbProducts;
    this.shopData = shopData;
    this.shopProducts = shopData[0];
    this.collectionArr = shopData[1];
    this.defaultNum = defaultNum;
    this.shop = shop;
    this.shopify = shopify;
    this.referenceMap = new Map();
    this.products2Add = this.createProducts2Add();
  }
  init(){
    return new Promise((resolve,reject)=>{
      if (this.products2Add.length){
        this.dbProducts = this.dbProducts.concat(this.products2Add);
        const addAlsoBought = new AddAlsoBought(this.products2Add, this.shopify,this.referenceMap)
        Promise.all([
          spModel.insertMany(this.products2Add),
          addAlsoBought.init(),
        ])
        .then(function(data){
          return assignNewAB(this.products2Add, this.defaultNum.allMostBought, this.shop,data[1])
        }.bind(this)).then(function(data){
          resolve([this.dbProducts,this.defaultNum,this.collectionArr])
        }.bind(this)).catch(function(err){
          console.log('error at addProducts2DB', err)
        })
      } else {
        resolve([this.dbProducts,this.defaultNum,this.collectionArr])
      }
    })
  }
  createProducts2Add(){
    const products2Add = [];
    if (this.dbProducts){
      this.shopProducts.forEach(shopProd=>{
        let need2add = true;
        this.dbProducts.forEach((currentDb) => {
          if (shopProd.id == currentDb.productID){
            need2add = false;
            return
          }
        })
        if (need2add == true){
          const image = this.makeImageString(shopProd.image)
          this.referenceMap.set(shopProd.id, {price:shopProd.variants[0].price, title:shopProd.title, handle:shopProd.handle, image:image,});
          const productInsert = new ProductInsert(shopProd,image,this.defaultNum.defaultNum);
          products2Add.push(productInsert)
        }
      })
      return products2Add
    } else {
      return null;
    }
  }
  //Returns imade link with __medium added to reduce load time on the store
  //or returns null if no image was actually passed
  makeImageString(image){
    if (image){
      image = image.src
      var num = this.findExtIndex(image)
      if (num > -1){
        return [image.slice(0,num), "_medium", image.slice(num)].join('');
      }
    }
    else{
      return null;
    }
  }
  //returns index of a img filetype in an image link string
  findExtIndex(word){
    var ext = ['.jpg','.jpeg','.png','.gif'];
    var returnIndex = null;
    ext.some(function(element){
      var index = word.indexOf(element);
      if (index > -1){
        returnIndex = index;
        return
      }
    })
    if (returnIndex){
      return returnIndex
    } else {
      return null;
    }
  }
}


//
//
// const referenceMap = new Map();
//
// function prodFromShopify(values, shop, shopify){
// return new Promise(function(resolve, reject){
//
//     var products2Add = [];
//     //gets put into add alsobought function
//     var ids2Add = [];
//     if (values[0] !== undefined){
//
//       values[1][0].forEach((shopProd) => {
//           var need2add = true;
//           values[0].forEach((currentDb) => {
//             // var cDB = currentDb.substring(0, currentDb.length - 1);
//             if (shopProd.id == currentDb.productID){
//               need2add = false;
//               return
//             }
//           })
//           if (need2add == true){
//
//             products2Add.push(shopProd);
//
//             var image;
//             if (shopProd.image){
//
//               image = shopProd.image.src
//               function findExtIndex(word){
//                  var ext = ['.jpg','.jpeg','.png','.gif'];
//                  var returnIndex = null;
//                  ext.some(function(element){
//                    var index = word.indexOf(element);
//                    if (index > -1){
//                      returnIndex = index;
//                      return
//                    }
//                  })
//                  if (returnIndex){
//                    return returnIndex
//                  } else {
//                    return null;
//                  }
//
//               }
//
//               var num = findExtIndex(image)
//               if (num > -1){
//                 image = [image.slice(0,num), "_medium", image.slice(num)].join('');
//               }
//
//             }
//             else{
//               image = null;
//             }
//             referenceMap.set(shopProd.id, {price:shopProd.variants[0].price, title:shopProd.title, handle:shopProd.handle, image:image,});
//             ids2Add.push({productID: shopProd.id, image: image,price:shopProd.variants[0].price,})
//           }
//       });
//
//     }
//
//
//
//
//
//
//       function insertNew(){
//         return new Promise((resolve,reject)=>{
//
//             console.log('Adding new products to DB');
//             var numOfArr = [];
//             var MongoClient = mongodb.MongoClient;
//
//              var url = "mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts"
//              MongoClient.connect(url, function(err, db){
//                if(err){
//                  console.log('Unable to connect' + err)
//                } else {
//                  console.log('Connection between Database Success at addProducts2Database');
//
//                  var collection = db.collection("StoreProducts");
//
//                  var errors = [];
//
//                  completeInsert = [];
//
//                  products2Add.forEach((element) => {
//                    var image;
//                    if (element.image){
//
//                      image = element.image.src
//                     //  var num = image.indexOf(".jpg");
//                     //  if (num == -1){
//                     //    num = image.indexOf(".png")
//                     //  }
//
//                      function findExtIndex(word){
//                        	var ext = ['.jpg','.jpeg','.png','.gif'];
//                        	var returnIndex = null;
//                        	ext.some(function(element){
//                        		var index = word.indexOf(element);
//                        		if (index > -1){
//                        			returnIndex = index;
//                        			return
//                        		}
//                        	})
//                        	if (returnIndex){
//                        		return returnIndex
//                        	} else {
//                        		return null;
//                        	}
//
//                      }
//
//                      var num = findExtIndex(image)
//                      if (num > -1){
//                        image = [image.slice(0,num), "_medium", image.slice(num)].join('');
//                      }
//
//                    }
//                    else{
//                      image = null;
//                    }
//
//                    var inserter = {
//                      "productID" : element.id.toString(),
//                      "title": element.title,
//                      "numOfRel": values[2].defaultNum,
//                      "store":shop,
//                      "image": image,
//                      "price": element.variants[0].price,
//                      "handle": element.handle,
//                      "locks": [false,false,false,false,false,false],
//                      "_collections": element.collections,
//                    }
//
//                    completeInsert.push(inserter)
//                    values[0].push(inserter)
//                    collection.insert(inserter,  function(err, result){
//                      if (err) {
//                       errors.push(err);
//                        console.log(" we got an error at addProducts2DB ");
//                        console.log(err)
//                      }
//                      else {
//                        console.log("inserted into document");
//
//                      }
//
//                  });
//
//
//
//                })
//
//
//                //adds also bought from the defaultNum how many are set to also bought all and also adds a temporary property for related products as a property of the product object
//
//                db.close();
//                resolve(completeInsert)
//                  //add complete insert retuned to values[0] down here instead
//                 //  products2Add(data)
//                 //  resolve([values[0],values[2]]);
//
//
//                }
//               })
//         })
//
//       }
//       if (products2Add.length > 0){
//         // console.log('products2Add',products2Add)
//         Promise.all([
//           insertNew(),
//           addAlsoBought(ids2Add, shopify,referenceMap)
//         ]).then(function(data){
//           return assignNewAB(data[0], values[2].allMostBought, shop,data[1])
//         }).then(function(data){
//           if (data){
//             values[0].concat(data)
//           }
//           resolve([values[0],values[2],values[1][1]])
//         }).catch(function(err){
//           console.log('error at addProducts2DB', err)
//         })
//        }
//
//
//        else {
//          resolve([values[0],values[2],values[1][1]])
//        }
//     // }
//
//
//
//
//
//  });
//
// }
module.exports = AddProducts2DB
