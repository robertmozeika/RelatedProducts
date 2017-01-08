var shopifyAPI = require('shopify-node-api');

function prodFromShopify(shopifyconfig){
  return new Promise(function(resolve, reject){
    if (resolve) {
      var shopify = new shopifyAPI(shopifyconfig)
      shopify.get('/admin/products.json',  function(err, data, headers){
              var stringdata = JSON.stringify(data.products);
                    resolve(stringdata)

                    if (err){
                      console.log("reject is " + err)
                      reject(err);
                    }
        });

      }



    });

}
module.exports = prodFromShopify;
