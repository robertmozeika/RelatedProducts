var shopModel = require('../models/shops.js');
var shopifyAPI = require('shopify-node-api');


var authorize = {

  connectShop: function(shop, req, res){
    // res.send('hello')
    shopModel.find({name: shop})
      .then(function(doc){
        if (doc.length){
          req.session.shopifyconfig = {
            shop: shop, // MYSHOP.myshopify.com
            shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
            shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
            access_token: doc[0].access_token,
            shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
            redirect_uri: 'https://simple-related-products.herokuapp.com/finish_auth',
            verbose: false,
          }

          var shopify = new shopifyAPI(req.session.shopifyconfig)

          var auth_url = shopify.buildAuthURL();
          res.redirect(auth_url);
        }





        else {
          req.session.shopifyconfig = {
            shop: shop, // MYSHOP.myshopify.com
            shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
            shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
            shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
            redirect_uri: 'https://simple-related-products.herokuapp.com/exchange',
            nonce: '1312312414afdafdasds2242323' // you must provide a randomly selected value unique for each authorization request
          };

          var shopify = new shopifyAPI(req.session.shopifyconfig)

          var auth_url = shopify.buildAuthURL();
          res.redirect(auth_url);


          // res.send('No store found')
        }
      })
  },



  saveAccessToken: function(shopname, access_token, res){
    var schemaData = {
      name: shopname,
      access_token: access_token,
      defaultNumOfRelated: 3,
      header: "Related Products",
      allMostBought: [false,false,false,false,false,false]
    }

    var insertToken = new shopModel(schemaData);
    insertToken.save();
    res.redirect('/?shop=' + shopname);
  }

}


module.exports = authorize;
