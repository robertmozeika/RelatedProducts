var ShopifyObj = require('./shopify.js')
 function prodFromShopify(){
return new Promise(function(resolve, reject){
  console.log("executie");
  if (resolve) {
    ShopifyObj.Shopify.get('/admin/products.json',  function(err, data, headers){
            var stringdata = JSON.stringify(data.products);
                  // console.log(stringdata); // Headers returned from request
                  // console.log("stringdata");
                  resolve(stringdata)
                  // response.render('layout', {
                  //         title: 'Related Products',
                  //         products: stringdata,
                  //         numOfRelPass: numRelArr,
                  // });
                  if (err){
                    console.log("reject is " + err)
                    reject(err);
                  }

      });
    }



  });

}
module.exports = prodFromShopify;
