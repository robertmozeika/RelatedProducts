const shopModel = require('../models/shops.js');
const updateAlsoBought = require('./updateAlsoBought.js');
const updateProductInfo = require('./updateProductInfo.js')



function refreshProductInterval(){

  shopModel.find()
    .then(function(doc){
      if (doc.length){
        doc.forEach((element)=>{
          const shopifyconfig = {
            shop: element.name, // MYSHOP.myshopify.com
            shopify_api_key: '55512454cd904b56d38a12c8573aa27a', // Your API key
            shopify_shared_secret: '6815b758b2996ee3ef116c112432a085', // Your Shared Secret
            access_token: element.access_token,
            shopify_scope: 'read_products,write_script_tags,read_script_tags,read_orders',
            redirect_uri: global.url + 'finish_auth',
            verbose: false,
          }

          updateProductInfo(shopifyconfig,element.name).then(data => {
            updateAlsoBought(shopifyconfig,element.name);
          });

        })
      }
    })
}



module.exports = refreshProductInterval
