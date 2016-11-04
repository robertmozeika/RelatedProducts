var express = require('express');
var router = express.Router();
var app = require('../app.js')
var ShopifyObj = require('../custom_modules/shopify.js');
var database = require('../custom_modules/database.js');
var index = require('./index');


// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){

    query_params = req.query;
    if (ShopifyObj.tempNeeded == true){
      console.log("temp is true")
      ShopifyObj.Shopify.exchange_temporary_token(query_params, function(err, data){
    // This will return successful if the request was authentic from Shopify
    // Otherwise err will be non-null.
    // The module will automatically update your config with the new access token
    // It is also available here as data['access_token']
      console.log("error here ", err, "data here ", data)
      database.saveAccessToken(index.shop_id, data['access_token'], res)
  });
}

//   var post_data = {
//     "product": {
//     "title": "Burton Custom Freestlye 151",
//     "body_html": "<strong>Good snowboard!</strong>",
//     "vendor": "Burton",
//     "product_type": "Snowboard",
//     "variants": [
//       {
//         "option1": "First",
//         "price": "10.00",
//         "sku": 123
//       },
//       {
//         "option1": "Second",
//         "price": "20.00",
//         "sku": "123"
//       }
//     ]
//   }
//
// }
//
// Shopify.post('/admin/products.json', post_data, function(err, data, headers){
//   console.log(err, data);
// });
//
// ShopifyObj.addScript();
// ShopifyObj.readAllProducts(res);



});

module.exports = router;
