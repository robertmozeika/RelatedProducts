var express = require('express');
var router = express.Router();
var spModel = require('../models/storeProducts.js');
var shopModel = require('../models/shops.js');


/* GET users listing. */
router.post('/', function(req, res, next) {
  var postData = req.body;
  postData.store = req.session.shop;
  console.log(req.session)

  var query = {
    productID:postData.productID,
    store:postData.store
  };
  var newData = {'numOfRel': postData.numOfRel}
  console.log(query)
  console.log(newData)
  spModel.findOneAndUpdate(query, newData, {upsert:false}, function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
  });


});

router.get('/', function(req,res,next){
  var query = {name: req.session.shop};
  var shopNewData = {defaultNumOfRelated: req.query.num};
  var checkChangeAll = req.query.checked;
  var productQuery = {store: req.session.shop};

  if (checkChangeAll){
    var productNewData = {numOfRel: req.query.num}

    spModel.update(productQuery, productNewData, {multi: true}, function(err, doc){
      if (err) console.log(err);
      else console.log('successfully updated all');
    })
  }

  shopModel.findOneAndUpdate(query, shopNewData, {upsert:false}, function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
  });




})

module.exports = router;
