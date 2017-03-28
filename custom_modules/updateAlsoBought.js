const shopModel = require('../models/shops.js');
const shopifyAPI = require('shopify-node-api');

const AddAlsoBought = require('../custom_modules/addAlsoBought.js');
const AssignNewProductAlsoBought = require('../custom_modules/assignNewProductAlsoBought.js');

const abModel = require('../models/alsoBoughtProducts.js');
const rpModel = require('../models/relatedProducts.js');
const spModel = require('../models/storeProducts.js');

function updateAlsoBought(shopifyconfig,shop){
    let abProds;
    let allProducts;
    console.log('hello! im doing something!')
    Promise.all([
    rpModel.find({locked:false}).remove(),
    abModel.find({}).remove()
    ]).then(function(){
    spModel.find({store: shop})
      .then(function(doc){
        allProducts = doc;
        const addAlsoBought = new AddAlsoBought(doc,shopifyconfig)
        return addAlsoBought.init();

      }).then(function(data){
        abProds = data;
        return shopModel.find({name: shop})
      }).then(function(doc){
        const assignNewProductAlsoBought = new AssignNewProductAlsoBought(allProducts,doc[0].allMostBought,shop,abProds)
        return assignNewProductAlsoBought.init();
      }).then(function(data){
        console.log('hopefully complete!')
      }).catch(function(err){
        console.log(err);
      })
    });
}

module.exports = updateAlsoBought