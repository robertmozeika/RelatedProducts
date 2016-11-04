var shopifyAPI = require('shopify-node-api');
var router = require('../routes/index.js')
var random = 4322423 * Math.random()
var randomstring = random.toString();
var fs = require('fs');
var ShopifyObj = {

  Shopify: null,
  tempNeeded: false,
  readTemp: function(){
    return ShopifyObj.tempNeeded
  },
  dataVar: {products:['1', '2', '3']},

  connectShopify: function(shopname, accessToken){
    ShopifyObj.Shopify = new shopifyAPI({
      shop: shopname, // MYSHOP.myshopify.com
      shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
      shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
      access_token: accessToken,
      shopify_scope: 'read_products',
      redirect_uri: 'http://localhost:3000/finish_auth',
      // nonce: '1312312414afdafdasds2242323' // you must provide a randomly selected value unique for each authorization request
    });


  },

  tempShopify: function(shopname){
    console.log('temp needed ran')
    ShopifyObj.tempNeeded = true;
    ShopifyObj.Shopify = new shopifyAPI({
      shop: shopname, // MYSHOP.myshopify.com
      shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
      shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
      shopify_scope: 'read_products',
      redirect_uri: 'http://localhost:3000/exchange',
      nonce: '1312312414afdafdasds2242323' // you must provide a randomly selected value unique for each authorization request
    });


  },

  readAllProducts: function(response, numRelArr){




      ShopifyObj.Shopify.get('/admin/products.json',  function(err, data, headers){
              var stringdata = JSON.stringify(data.products);

                    
    })

  },
  addScript: function(){
    var post_data = {
      "script_tag": {
    "event": "onload",
    "src": "https:\/\/djavaskripped.org\/fancy.js"
    }

    }

    ShopifyObj.Shopify.post('/admin/products.json', post_data, function(err, data, headers){
      console.log(err, data);
    });
  }


}

module.exports = ShopifyObj;
