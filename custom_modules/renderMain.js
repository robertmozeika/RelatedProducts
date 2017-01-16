const GetNumOfRel = require('./getNumOfRel.js');
const GetShop = require('./getShopifyData.js');
const addProducts2DB = require('./addsProducts2DB.js');
const getDefaultNum = require('./getDefaultNum.js');

function renderPromises(res,shop,shopConfig){
  const getNumOfRel = new GetNumOfRel(res,shop);
  const getShop = new GetShop(shopConfig);

  Promise.all([
    getNumOfRel.init(),
    getShop.init(),
    getDefaultNum(shop)
  ]).then(function(values){
    console.log('checkhere',values[0])
    return addProducts2DB(values, shop, shopConfig)
  }).then(function(values){
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
  }).catch(reason =>{
    console.log(reason)
  });
}

module.exports = renderPromises
