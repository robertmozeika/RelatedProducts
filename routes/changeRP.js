var express = require('express');
var router = express.Router();
var rpModel = require('../models/relatedProducts.js');
var bpModel = require('../models/alsoBoughtProducts.js');


/* GET users listing. */
router.post('/', function(req, res, next) {
  var postData = req.body;

  postData.forStore = req.session.shop;
  var query = {
    forProduct:postData.productID,
    order: postData.order,
    forStore:postData.forStore
  };
  var newData = {
    'productID': postData.newProduct.productID,
    'title': postData.newProduct.title,
    'image': postData.newProduct.image,
  }

  rpModel.findOneAndUpdate(query, newData, {upsert:false}, function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
  });


});

router.get('/', function(req,res,next){


  var query = {
    forStore: req.session.shop,
    forProduct: req.query.productID,
  }

  console.log(query)

  bpModel.find(query)
    .then(function(doc){
      console.log('returned successful');
      console.log(doc)
      res.send(doc)
    })


})

router.post('/multiple',function(req,res,next){
  const { products, order,productID,title,image } = req.body;
  console.log(req.body)
  const queryData = {
    forStore: req.session.shop,
    order,
    forProduct: {$in: products},
  }
  const updateData = {
    productID,
    title,
    image,
  }
  rpModel.find(queryData)
    .then((doc)=>{
      console.log(doc)
    })

  rpModel.update(queryData,updateData,{multi:true},function(err,doc){
    console.log(err,doc)
  })
})


module.exports = router;
