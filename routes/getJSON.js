var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var ShopifyObj = require('../custom_modules/shopify.js')


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

router.get('/rest', function(req, res, next){
  function prodFromShopify(){


    ShopifyObj.Shopify.delete('/admin/script_tags/85163216.json', function(err, data, headers){
      console.log(err, data)
    });


 }

 prodFromShopify();

})

router.get('/pest', function(req, res, next){
  ShopifyObj.Shopify.get('/admin/script_tags.json',  function(err, data, headers){
    console.log(data)
        res.send(data)
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

      firstcollection.find({"productName": prodReg, "store":shop}).toArray(function(err, result){
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
      console.log(err, data)
      //array of all emails who people who bought the item at hand
      var peopleWhoBought = [];
      data.orders.forEach((element)=>{
        element.line_items.forEach((line)=>{
          if (line.product_id == 6560603013){
            peopleWhoBought.push(element.email);
          }
        })
      })
      let seen = new Set();

      function testPB(value){
        return (peopleWhoBought.indexOf(value.email) > -1)
      }

      //filters all data to people who bought the product at hand
      var peopleWhoBoughtOrders = data.orders.filter(testPB);

      // var hasDuplicates = [];
      // peopleWhoBought.forEach(function(currentObject) {
      //
      //   if (seen.email === seen.add(currentObject).email){
      //     hasDuplicates.push(currentObject)
      //   }
      //
      // });

      // console.log(hasDuplicates)
      res.send(peopleWhoBoughtOrders)
    });

})



module.exports = router;
