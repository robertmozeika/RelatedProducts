var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var shopifyAPI = require('shopify-node-api');
var shopModel = require('../models/shops.js');
var spModel = require('../models/storeProducts.js');
var rpModel = require('../models/relatedProducts.js');






router.get('/client', function(req, res, next){

  var product = req.query.handle.replace(/-/g, " ");
  var prodReg = new RegExp(product, "gi");

  console.log(prodReg)
  var shop = req.query.shop;
  var testobj = {prod: product};



  function getHeader(){
      return new Promise((resolve,reject)=>{
        shopModel.find({name: shop})
          .then(function(doc){
            if (doc){
              resolve(doc[0].header)
            } else {
              reject('none found at getHeader')
            }
          })

      })

    }
    function findProduct(){
        return new Promise((resolve,reject)=>{
          spModel.find({"title": prodReg, "store":shop})
            .then(function(doc){
              if (doc){
                resolve([doc[0].productID, doc[0].numOfRel])
              } else {
                reject('none found at findProduct')
              }
            })
          })
      }


    function nextSearch(values) {
      rpModel.find({"forStore":shop, "forProduct":values[1][0]})
        .then(function(doc){
          sendResult = [];
          for (var i = 0; i < values[1][1]; i++){
            sendResult.push(doc[i+1])
          }
          console.log(sendResult);
          var obj = {
            products: sendResult,
            header: values[0],
          }
          res.json(obj);
        })
    }

    Promise.all([
      getHeader(),
      findProduct(),
    ]).then(function(values){
      return nextSearch(values)
    })


})


router.get('/image', function(req, res, next){
    ShopifyObj.Shopify.get('/admin/products/6689729349/images.json', function(err, data, headers){
      console.log(err, data)
    });

})

router.get('/getOrders', function(req, res, next){
    ShopifyObj.Shopify.get('/admin/orders.json', function(err, data, headers){
      var productAtHand = 6560603013;
      console.log(err, data)
      //array of all emails who people who bought the item at hand
      var peopleWhoBought = [];
      data.orders.forEach((element)=>{
        element.line_items.forEach((line)=>{
          if (line.product_id == productAtHand){
            peopleWhoBought.push(element.email);
          }
        })
      })
      let seen = new Set();

      function testPB(value){
        return (peopleWhoBought.indexOf(value.email) > -1)
      }

      var peopleWhoBoughtOrders = data.orders.filter(testPB);

      var productsAlsoBought = [];
      peopleWhoBoughtOrders.forEach((element)=>{
        element.line_items.forEach((item)=>{
          if (item.product_id !== productAtHand){
            productsAlsoBought.push(item)
          }
        })
      })

      var alsoBoughtInsert = [];
      productsAlsoBought.forEach((element)=>{
            var seen = false;
            var atIndex = -1;
            for(var j = 0; j != alsoBoughtInsert.length; ++j) {
                if(alsoBoughtInsert[j].productID == element.product_id){
                 seen = true;
                 atIndex = j;
                 console.log(alsoBoughtInsert)
                 console.log(j)
               }
            }
            if (seen){
              alsoBoughtInsert[atIndex].howMany = alsoBoughtInsert[atIndex].howMany + 1
            } else {
              var store = element.vendor.replace(/ /g, "-");
              store = store.toLowerCase();
              console.log(store)
              var abObj = {
                forStore: store,
                forProduct: productAtHand.toString(),
                productID: element.product_id.toString(),
                title: element.title,
                howMany:1,
              }
              alsoBoughtInsert.push(abObj)
            }

      })


      res.send(alsoBoughtInsert)
    });

})


var myjson = {
  author: "audrey hepborn",
  book: [{title: "to kill a mockingbird"}, {title: "great gatsby"}]
}
/* GET users listing. */
router.post('/', function(req, res, next) {
  var query = req.body;
  console.log(query)
  res.send(query)
});

router.get('/food', function(req,res,next){
  console.log('hello');
  res.send('worked')
})

router.get('/thelist', function(req, rest){
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb:localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');

      var collection = "dog"
    }
  })
})

router.get('/test', function(req, res, next){

   function prodFromShopify(){
     var post_data = {
       "script_tag": {
       "event": "onload",
       "src": "https:\/\/dl.dropboxusercontent.com\/s\/rzer5jwfc6f742c\/example.js"
     }

     }

     ShopifyObj.Shopify.post('/admin/script_tags.json', post_data, function(err, data, headers){
       console.log(err, data)
     });
  }

  prodFromShopify();



})

router.get('/trest', function(req, res, next){
  var ShopifyObj = new shopifyAPI(req.session.shopifyconfig)

   function prodFromShopify(){
     var post_data = {
       "script_tag": {
       "event": "onload",
       "src": "https:\/\/dl.dropboxusercontent.com\/s\/goyefog63vzbdje\/test.txt"
     }

     }

     ShopifyObj.post('/admin/script_tags.json', post_data, function(err, data, headers){
       console.log(err, data)
       res.send(data)
     });
  }

  prodFromShopify();



})

router.get('/trest', function(req, res, next){
  var ShopifyObj = new shopifyAPI(req.session.shopifyconfig)

   function prodFromShopify(){
     var post_data = {
       "script_tag": {
       "event": "onload",
       "src": "https:\/\/dl.dropboxusercontent.com\/s\/8ftx370vb3mcx2d\/other.html"
     }

     }

     ShopifyObj.post('/admin/script_tags.json', post_data, function(err, data, headers){
       console.log(err, data)
       res.send(data)
     });
  }

  prodFromShopify();



})


router.get('/rest', function(req, res, next){
  function prodFromShopify(){


    ShopifyObj.Shopify.delete('/admin/script_tags/85163216.json', function(err, data, headers){
      console.log(err, data)
    });


 }

 prodFromShopify();

})

router.get('/pest', function(req, res, next){
  console.log(req.session.shopifyconfig)
  var ShopifyObj = new shopifyAPI(req.session.shopifyconfig)

  ShopifyObj.get('/admin/script_tags.json',  function(err, data, headers){
    if (err){
      console.log(err)
    } else {
    console.log(data)
        res.send(data)
    }
    });
})






module.exports = router;
