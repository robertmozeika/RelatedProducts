var express = require('express');
var router = express.Router();
var app = require('../app.js')
var ShopifyObj = require('./shopify.js');
// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){



  var post_data = {
    "product": {
    "title": "Burton Custom Freestlye 151",
    "body_html": "<strong>Good snowboard!</strong>",
    "vendor": "Burton",
    "product_type": "Snowboard",
    "variants": [
      {
        "option1": "First",
        "price": "10.00",
        "sku": 123
      },
      {
        "option1": "Second",
        "price": "20.00",
        "sku": "123"
      }
    ]
  }

}

ShopifyObj.Shopify.post('/admin/products.json', post_data, function(err, data, headers){
  console.log(err, data);
});





});

module.exports = router;
