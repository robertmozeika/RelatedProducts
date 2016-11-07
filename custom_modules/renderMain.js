var getNumOfRel = require('./getNumOfRel.js');
var getShop = require('./getShopifyData.js');
var addProducts2DB = require('./addsProducts2DB')

function renderPromises(res){


  Promise.all([
    getNumOfRel(res),
    getShop()


  ]).then(function(values){
    return new Promise((resolve, reject) => {
    values[0][0].render('layout', {
            title: 'Related Products',
            products: values[1],
            numOfRelPass: values[0][1],
            defaultNum: "3",


    });

  resolve(values)

  })

  }).then(function(fromPromise){
    return addProducts2DB(fromPromise)
  } ).catch(reason => {
    console.log(reason)});


}

module.exports = renderPromises
