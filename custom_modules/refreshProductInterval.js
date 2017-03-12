const shopModel = require('../models/shops.js');
const shopifyAPI = require('shopify-node-api');

var addAlsoBought = require('../custom_modules/addAlsoBought.js');
var setAllMostBought = require('../custom_modules/setAllMostBought.js');
var assignNewProductAlsoBought = require('../custom_modules/assignNewProductAlsoBought.js')

var abModel = require('../models/alsoBoughtProducts.js');
var rpModel = require('../models/relatedProducts.js');
var spModel = require('../models/storeProducts.js');

const GetShopData = require('../custom_modules/getShopifyData');
const fixImage = require('../custom_modules/imageToMedium.js');



function refreshProductInterval(){

  shopModel.find()
    .then(function(doc){
      if (doc.length){
        doc.forEach((element)=>{
          const shopifyconfig = {
            shop: element.name, // MYSHOP.myshopify.com
            shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
            shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
            access_token: element.access_token,
            shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
            redirect_uri: 'https://simple-related-products.herokuapp.com/finish_auth',
            verbose: false,
          }

          updateStores(shopifyconfig,element.name)

          // shopify.get('/admin/products.json',  function(err, data, headers){
          //         // var stringdata = JSON.stringify(data.products);
          //               // resolve(JSON.parse(stringdata))
          //               console.log(data.products)
          //
          //               if (err){
          //                 console.log("reject is " + err)
          //                 // reject(err);
          //               }
          // });

        })


        //
        // var auth_url = shopify.buildAuthURL();
        // res.redirect(auth_url);
      }
    })

//
//   const { shop, shopifyconfig } = req.session;
//
//   const shopMap = new Map();
//   const dbMap = new Map();
//
//
function updateStores(shopifyconfig,shop){
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

    var abProds = [];
    var allProducts = [];

    Promise.all([
    rpModel.find({locked:false}).remove(),
    abModel.find({}).remove()
    ]).then(function(){
    spModel.find({store: req.session.shop})
      .then(function(doc){
        allProducts = doc;
        return addAlsoBought(doc,req.session.shopifyconfig)

      }).then(function(data){
        abProds = data;

        return shopModel.find({name:req.session.shop})
      }).then(function(doc){
      // console.log(doc)
      // console.log(abProds)

        return assignNewProductAlsoBought(allProducts,doc[0].allMostBought,req.session.shop,abProds)
      }).then(function(data){
        // res.send('respond with a resource');
        return refreshProductInfo()

      }).catch(function(err){
        res.send(err);
      })
    });
}
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


module.exports = refreshProductInterval
