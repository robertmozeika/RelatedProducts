var shopifyAPI = require('shopify-node-api');

function createShopConfig(shop,access_token){
  const config = {
    shop: shop, // MYSHOP.myshopify.com
    shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
    shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
    shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
    verbose: false,
  }
  if (access_token){
    config.access_token = access_token;
    config.redirect_uri = 'https://localhost:8888/finish_auth';

  } else {
    config.redirect_uri = 'https://localhost:8888/exchange';
    config.nonce = (Math.random() * 1000000).toString();
  }
  return config;
}

module.exports = createShopConfig
