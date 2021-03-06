var express = require('express');
var router = express.Router();
var spModel = require('../models/storeProducts.js')
var rpModel = require('../models/relatedProducts.js')
const verifyHMAC = require('../custom_modules/verifyHMAC.js');



/* GET users listing. */
router.post('/', function(req, res, next) {
  const VerifyHMAC = new verifyHMAC(req.headers.referer,true,verifySuccess,res);
  function verifySuccess(){
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
  }


  // if (verifyHMAC(req.headers.referer,true)){
  //
  //   console.log(req.body);
  //
  //   // var selectedProduct = new spMode(spSchema);
  //
  //   var spSchema = {
  //     'store': req.session.shop,
  //     'productID': req.body.productID,
  //
  //   }
  //
  //   var specifiedLock = 'locks.' + req.body.index.toString();
  //   console.log(specifiedLock)
  //   var setter = {};
  //   setter[specifiedLock] = req.body.bool;
  //
  //   function updateSP(){
  //     return new Promise((resolve,reject)=>{
  //         spModel.findOneAndUpdate(spSchema,{$set:setter}, {upsert: false}, function(err,suc){
  //           if (err){
  //             reject(err)
  //
  //           } else{
  //             resolve(suc)
  //           }
  //         })
  //     })
  //   }
  //
  //   var { bool } = req.body;
  //   const rpSchema = {
  //     store: req.session.shop,
  //     forProduct: req.body.productID,
  //     order: req.body.index,
  //   }
  //
  //   function updateRP(){
  //     return new Promise((resolve,reject)=>{
  //         // rpModel.find(rpSchema)
  //         //   .then((doc)=>{
  //         //     console.log('##',doc),
  //         //     res.send(doc)
  //         //   })
  //         rpModel.findOneAndUpdate(rpSchema,{$set:{locked:bool}}, {upsert: false}, function(err,suc){
  //           if (err){
  //             reject(err)
  //
  //           } else{
  //             console.log('##',suc)
  //             resolve(suc)
  //           }
  //         })
  //       })
  //   }
  //
  //   Promise.all([
  //     updateSP(),
  //     updateRP(),
  //   ]).then((values)=>{
  //     res.send(values)
  //     console.log(values)
  //   }).catch((err)=>{
  //     console.log(err);
  //     res.send(err)
  //   })
  // } else {
  //   res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  // }



});

router.post('/multiple', function(req, res, next) {
  const VerifyHMAC = new verifyHMAC(req.headers.referer,true,verifySuccess,res);
  function verifySuccess(){
    var spSchema = {
      'store': req.session.shop,
      'productID': {$in: req.body.productIDs},

    }
    console.log('made it here')
    var specifiedLock = 'locks.' + req.body.index.toString();
    console.log(specifiedLock)
    var setter = {};
    setter[specifiedLock] = req.body.bool;



    function updateSP(){
      return new Promise((resolve,reject)=>{
        spModel.update(spSchema,setter,{multi:true})
          .then((doc)=>{
            console.log(doc)
          }).catch((err)=>{
            console.log(err)
          })
      })
    }

    var { bool } = req.body;
    console.log('BOOL', bool)
    const rpSchema = {
      store: req.session.shop,
      forProduct: {$in: req.body.productIDs},
      order: req.body.index,
    }

    function updateRP(){
      return new Promise((resolve,reject)=>{
          // rpModel.find(rpSchema)
          //   .then((doc)=>{
          //     console.log('##',doc),
          //     res.send(doc)
          //   })
          rpModel.update(rpSchema,{$set:{locked:bool}}, {multi: true})
            .then((doc)=>{
              console.log(doc)
            }).catch((err)=>{
              console.log(err)
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
  }
  // if (verifyHMAC(req.headers.referer,true)){
  //
  //   console.log(req.body);
  //
  //
  //   var spSchema = {
  //     'store': req.session.shop,
  //     'productID': {$in: req.body.productIDs},
  //
  //   }
  //   console.log('made it here')
  //   var specifiedLock = 'locks.' + req.body.index.toString();
  //   console.log(specifiedLock)
  //   var setter = {};
  //   setter[specifiedLock] = req.body.bool;
  //
  //
  //
  //   function updateSP(){
  //     return new Promise((resolve,reject)=>{
  //       spModel.update(spSchema,setter,{multi:true})
  //         .then((doc)=>{
  //           console.log(doc)
  //         }).catch((err)=>{
  //           console.log(err)
  //         })
  //     })
  //   }
  //
  //   var { bool } = req.body;
  //   const rpSchema = {
  //     store: req.session.shop,
  //     forProduct: {$in: req.body.productIDs},
  //     order: req.body.index,
  //   }
  //
  //   function updateRP(){
  //     return new Promise((resolve,reject)=>{
  //         // rpModel.find(rpSchema)
  //         //   .then((doc)=>{
  //         //     console.log('##',doc),
  //         //     res.send(doc)
  //         //   })
  //         rpModel.update(rpSchema,{$set:{locked:bool}}, {multi: true})
  //           .then((doc)=>{
  //             console.log(doc)
  //           }).catch((err)=>{
  //             console.log(err)
  //           })
  //       })
  //   }
  //
  //   Promise.all([
  //     updateSP(),
  //     updateRP(),
  //   ]).then((values)=>{
  //     res.send(values)
  //     console.log(values)
  //   }).catch((err)=>{
  //     console.log(err);
  //     res.send(err)
  //   })
  // } else {
  //   res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  // }



});

module.exports = router;
