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
      // const [ res, products ] = values[0];
      res.set({
        'X-Frame-Options': 'ALLOW-FROM https://myshopify.com/'
      })
      res.render('layout', {
              title: 'Related Products',
              shop: shop,
              numOfRelPass: values[0],
              defaultNum: values[1],
              collections: values[2]
      });
  }).catch(reason =>{
    console.log(reason)
  });
}

module.exports = renderPromises
