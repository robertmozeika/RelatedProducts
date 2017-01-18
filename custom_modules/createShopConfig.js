var shopifyAPI = require('shopify-node-api');


function createShopConfig(shop,access_token){
  const config = {
    shop: shop, // MYSHOP.myshopify.com
    shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
    shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
    shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
    verbose: false,
  }
  global.api = '55512454cd904b56d38a12c8573aa27a'
  if (global.url == "https://localhost:3000/"){
    global.api = "1d3123095b67dd17a7f1cf48b8763379";
    config.shopify_api_key = "1d3123095b67dd17a7f1cf48b8763379";
    config.shopify_shared_secret = "09669da38e6cedc214415e9bc147860d";
  }

  if (access_token){
    config.access_token = access_token;
    // config.redirect_uri = 'https://simple-related-products.herokuapp.com/finish_auth';
    config.redirect_uri = global.url + 'finish_auth';


  } else {
    config.redirect_uri = global.url + 'exchange';
    config.nonce = (Math.random() * 1000000).toString();
  }
  return config;
}

module.exports = createShopConfig
