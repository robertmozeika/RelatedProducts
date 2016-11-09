var getNumOfRel = require('./getNumOfRel.js');
var getShop = require('./getShopifyData.js');
var addProducts2DB = require('./addsProducts2DB.js');
var getDefaultNum = require('./getDefaultNum.js')

function renderPromises(res){


  Promise.all([
    getNumOfRel(res),
    getShop(),
    getDefaultNum()


  ]).then(function(values){
    return addProducts2DB(values)


  }).then(function(values){

      values[0][0].render('layout', {
              title: 'Related Products',
              products: values[1],
              numOfRelPass: values[0][1],
              defaultNum: values[2],

    });

  } ).catch(reason => {
    console.log(reason)});


}

module.exports = renderPromises
