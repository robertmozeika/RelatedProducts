const express = require('express');
const router = express.Router();
const getShopData = require('../custom_modules/getShopifyData');
const fixImage = require('../custom_modules/imageToMedium.js');

const spModel = require('../models/storeProducts.js');
const abModel = require('../models/alsoBoughtProducts.js')
const rpModel = require('../models/relatedProducts.js')


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


/* GET users listing. */
router.get('/', function(req, res, next) {
  const { shop, shopifyconfig } = req.session;

  const shopMap = new Map();
  const dbMap = new Map();


  Promise.all([
    getShopData(shopifyconfig),
    spModel.find({store: shop})
  ]).then(([ shopProducts, dbProducts ])=>{
      // console.log('sps',shopProducts);
      // console.log('dbs',dbProducts);


      console.log(shopProducts[0])
      shopProducts[0].forEach((product)=>{
        if (product.image){
          shopMap.set(product.id.toString(),{title: product.title, image: fixImage(product.image.src),price: product.variants[0].price,collections: product.collections})
        } else {
          shopMap.set(product.id.toString(),{title: product.title, image: null,price: product.variants[0].price,collections: product.collections})
        }
      })
      // console.log(shopMap);


      dbProducts.forEach((product)=>{
          dbMap.set(product.productID,{title: product.title, image: product.image,price: product.price,_collections: product._collections})
      })


      // console.log(dbMap)
      const finder = [];
      const setter = [];

      shopMap.forEach((value,key)=>{
        console.log('key',key);
        console.log('value',value);
        const dbMapVal = dbMap.get(key)
        console.log('got',dbMapVal);
        const setterPush = {};
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
          console.log('same title');
        } else {
          console.log('different title');
          setterPush.title = value.title;
        }
        console.log('$$',dbMapVal._collections);
        console.log(value.collections)
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

    console.log(finder,setter);
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
      console.log(data);
      console.log(promiseArr);
      res.send([finder,setter])
    })




  })


  })


module.exports = router;
