var ShopifyObj = require('./shopify.js')
 function prodFromShopify(){
return new Promise(function(resolve, reject){
  if (resolve) {

    ShopifyObj.Shopify.get('/admin/products.json',  function(err, data, headers){
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
