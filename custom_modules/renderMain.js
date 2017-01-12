var getNumOfRel = require('./getNumOfRel.js');
var getShop = require('./getShopifyData.js');
var addProducts2DB = require('./addsProducts2DB.js');
var getDefaultNum = require('./getDefaultNum.js');

function renderPromises(res,shop,shopify){


  Promise.all([
    getNumOfRel(res, shop),
    getShop(shopify),
    getDefaultNum(shop)


  ]).then(function(values){
    return addProducts2DB(values, shop, shopify)


  }).then(function(values){
    // console.log(values)
        console.log(values[2])
        console.log('rendering')
        values[0][0].set({
          'X-Frame-Options': 'ALLOW-FROM https://myshopify.com/'
        })
        values[0][0].render('layout', {
                title: 'Related Products',
                shop: values[0][3],
                numOfRelPass: values[0][1],
                defaultNum: values[1],
                relatedProducts: values[0][2],
                collections: values[2]
        });


  } ).catch(reason => {
    console.log(reason)});


}

module.exports = renderPromises
