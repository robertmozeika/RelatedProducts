var ShopifyObj = require('./shopify.js')
function prodFromShopify(insert){
  return new Promise(function(resolve, reject){
    console.log(insert)
    insert.forEach((element)=>{
      ShopifyObj.Shopify.get('/admin/products/' + element.id + '/images.json', function(err, data, headers){
        if (data.images.length > 0 ){

          insert.image = data.images[0].src

        }
      });

    })



  }
)}

module.exports = prodFromShopify;
