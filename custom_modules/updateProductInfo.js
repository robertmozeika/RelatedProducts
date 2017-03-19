const abModel = require('../models/alsoBoughtProducts.js');
const rpModel = require('../models/relatedProducts.js');
const spModel = require('../models/storeProducts.js');

const GetShopData = require('../custom_modules/getShopifyData');
const fixImage = require('../custom_modules/imageToMedium.js');


function updateProductInfo(shopifyconfig,shop){
    const shopMap = new Map();
    const dbMap = new Map();
    const getShopData = new GetShopData(shopifyconfig);

      return Promise.all([
        getShopData.init(),
        spModel.find({store: shop})
      ]).then(([ shopProducts, dbProducts ])=>{



          shopProducts[0].forEach((product)=>{
            if (product.image){
              shopMap.set(product.id.toString(),{title: product.title, image: fixImage(product.image.src),price: product.variants[0].price,collections: product.collections})
            } else {
              shopMap.set(product.id.toString(),{title: product.title, image: null,price: product.variants[0].price,collections: product.collections})
            }
          })


          dbProducts.forEach((product)=>{
              dbMap.set(product.productID,{title: product.title, image: product.image,price: product.price,_collections: product._collections})
          })


          const finder = [];
          const setter = [];

          shopMap.forEach((value,key)=>{

            const dbMapVal = dbMap.get(key)
            const setterPush = {};
            console.log(key)
            console.log(value)
            console.log(dbMapVal)
            console.log(dbMap)
            if (dbMapVal == undefined || value == undefined){
              console.log('pause')
            }
            if (dbMapVal.image == value.image){
              console.log('same images')
            } else {
              console.log('different images');
              setterPush.image = value.image;
            }

            if (dbMapVal.price == value.price){
              console.log('same price')
            } else {
              console.log('different price');
              setterPush.price = value.price;
            }

            if (dbMapVal.title == value.title){
            } else {
              setterPush.title = value.title;
            }

            if (value.collections){
              if (dbMapVal._collections.equals(value.collections)){
                console.log('same collections')
              } else {
                console.log('different collections')
                setterPush._collections = value.collections

              }
            }
            if (Object.keys(setterPush).length){
              finder.push({
                store: shop,
                productID: key,
              })
              setter.push(setterPush)
            }


        })

        const promiseArr = [];
        finder.forEach((element,index)=>{
          promiseArr.push(spModel.findOneAndUpdate(element,setter[index],{upsert:false},function(err,suc){
            console.log(err,suc)
          }))
          promiseArr.push(rpModel.update(element,setter[index],{multi:true},function(err,suc){
            console.log(err,suc)
          }))
          promiseArr.push(abModel.update(element,setter[index],{multi:true},function(err,suc){
            console.log(err,suc)
          }))

        })


        Promise.all(promiseArr).then((data)=>{

          // res.send([finder,setter]);
          console.log('completed Update')
        })
    }).catch(function(err){
      console.log('error here', err)
    })
}







Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
      return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
      return false;

  for (var i = 0, l=this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
          // recurse into the nested arrays
          if (!this[i].equals(array[i]))
              return false;
      }
      else if (this[i] != array[i]) {
          // Warning - two different object instances will never be equal: {x:20} != {x:20}
          return false;
      }
  }
  return true;
}

module.exports = updateProductInfo