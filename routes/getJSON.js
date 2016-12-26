var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var shopifyAPI = require('shopify-node-api');



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




router.get('/client', function(req, res, next){

  var product = req.query.handle.replace(/-/g, " ");
  var prodReg = new RegExp(product, "gi");

  console.log(prodReg)
  var shop = req.query.shop;
  var testobj = {prod: product};
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');

      var firstcollection = db.collection('StoreProducts');

      function nextSearch(pid, num) {
        var collection = db.collection('RelatedProducts');
        collection.find({"forStore":shop, "forProduct":pid}).toArray(function(err, result){
          sendResult = [];
          for (var i = 0; i < num; i++){
            sendResult.push(result[i])
          }
          console.log(sendResult);
          res.json(sendResult);
        });
      }

      firstcollection.find({"title": prodReg, "store":shop}).toArray(function(err, result){
        if (err){
          console.log(err)
        }
        console.log('went here')
        nextSearch(result[0].productID, result[0].numOfRel)


      })


    }
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



module.exports = router;
