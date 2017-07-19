const shopModel = require('../models/shops.js');
const updateAlsoBought = require('./updateAlsoBought.js');
const updateProductInfo = require('./updateProductInfo.js');
var createShopConfig = require('./createShopConfig.js')




function refreshProductInterval(){

  shopModel.find()
    .then(function(doc){
      if (doc.length){
        doc.forEach((element)=>{
          if (element.access_token){
            const shopifyconfig = createShopConfig(element.name,element.access_token);
            updateProductInfo(shopifyconfig,element.name).then(data => {
            updateAlsoBought(shopifyconfig,element.name);
          })
          }

          ;

        })
      }
    })
}



module.exports = refreshProductInterval
