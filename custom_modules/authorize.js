var shopModel = require('../models/shops.js');
var shopifyAPI = require('shopify-node-api');
var createShopConfig = require('./createShopConfig.js')


var authorize = {

  connectShop: function(shop, req, res){
    shopModel.find({name: shop})
      .then(function(doc){
        if (doc.length){
          req.session.shopifyconfig = createShopConfig(shop,doc[0].access_token)
          var shopify = new shopifyAPI(req.session.shopifyconfig)
          var auth_url = shopify.buildAuthURL();
          res.redirect(auth_url);
        }
        else {
          req.session.shopifyconfig = createShopConfig(shop)

          var shopify = new shopifyAPI(req.session.shopifyconfig)

          var auth_url = shopify.buildAuthURL();
          res.redirect(auth_url);

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
