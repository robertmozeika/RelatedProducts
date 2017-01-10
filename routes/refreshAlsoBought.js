var express = require('express');
var router = express.Router();
var addAlsoBought = require('../custom_modules/addAlsoBought.js');
var setAllMostBought = require('../custom_modules/setAllMostBought.js');
var assignNewProductAlsoBought = require('../custom_modules/assignNewProductAlsoBought.js')

var abModel = require('../models/alsoBoughtProducts.js');
var storeModel = require('../models/shops.js');
var rpModel = require('../models/relatedProducts.js');
var spModel = require('../models/storeProducts.js');



/* GET users listing. */
router.get('/', function(req, res, next) {
  var abProds = [];
  var allProducts = [];

  Promise.all([
    rpModel.find({locked:false}).remove(),
    abModel.find({}).remove()
  ]).then(function(){
    spModel.find({store: req.session.shop})
      .then(function(doc){
        allProducts = doc;
        return addAlsoBought(doc,req.session.shopifyconfig)

      }).then(function(data){
        abProds = data;

        return storeModel.find({name:req.session.shop})
      }).then(function(doc){
      // console.log(doc)
      // console.log(abProds)

        return assignNewProductAlsoBought(allProducts,doc[0].allMostBought,req.session.shop,abProds)
      }).then(function(data){
        res.send('respond with a resource');

      }).catch(function(err){
        res.send(err);
      })
  });


});

module.exports = router;
