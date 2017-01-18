const GetNumOfRel = require('./getNumOfRel.js');
const GetShop = require('./getShopifyData.js');
const AddProducts2DB = require('./addsProducts2DB.js');
const getDefaultNum = require('./getDefaultNum.js');

function renderPromises(res,shop,shopConfig){
  const getNumOfRel = new GetNumOfRel(res,shop);
  const getShop = new GetShop(shopConfig);

  Promise.all([
    getNumOfRel.init(),
    getShop.init(),
    getDefaultNum(shop)
  ]).then(function(values){
    var addProducts2DB = new AddProducts2DB(values, shop, shopConfig)
    return addProducts2DB.init()
  }).then(function(values){
      res.render('layout', {
              title: 'Related Products',
              shop: shop,
              numOfRelPass: values[0],//from getNumOfRel plus added from the addsProducts2DB function
              defaultNum: values[1],
              collections: values[2],
              api: global.api,
      });
  }).catch(reason =>{
    console.log(reason)
  });
}

module.exports = renderPromises
