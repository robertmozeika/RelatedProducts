var express = require('express');
var router = express.Router();
var app = require('../app.js')


var shopifyAPI = require('shopify-node-api');
var authorize = require('../custom_modules/authorize.js')



// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){
    var shop_session = req.session.shop;
    query_params = req.query;
    var shopify = new shopifyAPI(req.session.shopifyconfig);
    var post_data = {
      "script_tag": {
      "event": "onload",
      "src": "https:\/\/dl.dropboxusercontent.com\/s\/rzer5jwfc6f742c\/example.js"
    }

    }

    shopify.post('/admin/script_tags.json', post_data, function(err, data, headers){
      console.log(err, data)
    });
      shopify.exchange_temporary_token(query_params, function(err, data){
    // This will return successful if the request was authentic from Shopify
    // Otherwise err will be non-null.
    // The module will automatically update your config with the new access token
    // It is also available here as data['access_token']
      // console.log("error here ", err, "data here ", data)
      authorize.saveAccessToken(shop_session, data['access_token'], res)
  });




});

module.exports = router;
