var express = require('express');
var router = express.Router();
var spModel = require('../models/storeProducts.js')
var rpModel = require('../models/relatedProducts.js')



/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);

  // var selectedProduct = new spMode(spSchema);

  var spSchema = {
    'store': req.session.shop,
    'productID': req.body.productID,

  }

  var specifiedLock = 'locks.' + req.body.index.toString();
  console.log(specifiedLock)
  var setter = {};
  setter[specifiedLock] = req.body.bool;

  function updateSP(){
    return new Promise((resolve,reject)=>{
        spModel.findOneAndUpdate(spSchema,{$set:setter}, {upsert: false}, function(err,suc){
          if (err){
            reject(err)

          } else{
            resolve(suc)
          }
        })
    })
  }

  var { bool } = req.body;
  const rpSchema = {
    store: req.session.shop,
    forProduct: req.body.productID,
    order: req.body.index,
  }

  function updateRP(){
    return new Promise((resolve,reject)=>{
        // rpModel.find(rpSchema)
        //   .then((doc)=>{
        //     console.log('##',doc),
        //     res.send(doc)
        //   })
        rpModel.findOneAndUpdate(rpSchema,{$set:{locked:bool}}, {upsert: false}, function(err,suc){
          if (err){
            reject(err)

          } else{
            console.log('##',suc)
            resolve(suc)
          }
        })
      })
  }

  Promise.all([
    updateSP(),
    updateRP(),
  ]).then((values)=>{
    res.send(values)
    console.log(values)
  }).catch((err)=>{
    console.log(err);
    res.send(err)
  })

});

module.exports = router;
