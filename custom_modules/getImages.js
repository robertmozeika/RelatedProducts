var ShopifyObj = require('./shopify.js')
function prodFromShopify(insert){
  return new Promise(function(resolve, reject){
    console.log(insert)
    insert.forEach((element)=>{
      console.log(element.id)
      ShopifyObj.Shopify.get('/admin/products/' + element.id + '/images.json', function(err, data, headers){
        if (data.images.length > 0 ){
          console.log('$$')

          console.log(err, data.images[0].src);
          insert.image = data.images[0].src

        }
      });

    })
    console.log('$$$');
    console.log(insert)


  }
)}

module.exports = prodFromShopify;
