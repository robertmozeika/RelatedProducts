var express = require('express');
var router = express.Router();
var rpModel = require('../models/relatedProducts.js');
var bpModel = require('../models/alsoBoughtProducts.js');


/* GET users listing. */
router.post('/', function(req, res, next) {
  var postData = req.body;

  postData.store = req.session.shop;
  var query = {
    forProduct:postData.productID,
    order: postData.order,
    store:postData.store
  };
  var newData = {
    'productID': postData.newProduct.productID,
    'title': postData.newProduct.title,
    'image': postData.newProduct.image,
    'price': postData.newProduct.price,
  }

  rpModel.findOneAndUpdate(query, newData, {upsert:false}, function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.send("succesfully saved");
  });


});

router.get('/', function(req,res,next){


  var query = {
    store: req.session.shop,
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
  const { products, order,productID,title,image,ow,price } = req.body;
  const allIDs =[];
  products.forEach((element)=>{
    if(ow){
      allIDs.push(element.productID)
    } else {
      if (!element.locks[order]){
        allIDs.push(element.productID)
      }
    }
  })
  const queryData = {
    store: req.session.shop,
    order,
    forProduct: {$in: allIDs},
  }
  const updateData = {
    productID,
    title,
    image,
    price,
  }

  rpModel.update(queryData,updateData,{multi:true},function(err,doc){
    console.log(err,doc)
    res.send('worked')
  })
})


module.exports = router;
