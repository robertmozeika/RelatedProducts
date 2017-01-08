const express = require('express');
const router = express.Router();
const getShopData = require('../custom_modules/getShopifyData');
const fixImage = require('../custom_modules/imageToMedium.js');

const spModel = require('../models/storeProducts.js');
const abModel = require('../models/alsoBoughtProducts.js')
const rpModel = require('../models/relatedProducts.js')



/* GET users listing. */
router.get('/', function(req, res, next) {
  const { shop, shopifyconfig } = req.session;

  const shopMap = new Map();
  const dbMap = new Map();


  Promise.all([
    getShopData(shopifyconfig),
    spModel.find({store: shop})
  ]).then(([ shopString, dbProducts ])=>{
      // console.log('sps',shopProducts);
      // console.log('dbs',dbProducts);


      const shopProducts = JSON.parse(shopString)
      console.log(shopProducts)
      shopProducts.forEach((product)=>{
        if (product.image){
          shopMap.set(product.id.toString(),{title: product.title, image: fixImage(product.image.src),price: product.variants[0].price})
        } else {
          shopMap.set(product.id.toString(),{title: product.title, image: null,price: product.variants[0].price})
        }
      })
      // console.log(shopMap);


      dbProducts.forEach((product)=>{
          dbMap.set(product.productID,{title: product.title, image: product.image,price: product.price})
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
