var express = require('express');
var router = express.Router();
var rpModel = require('../models/relatedProducts.js');
var bpModel = require('../models/alsoBoughtProducts.js');
const verifyHMAC = require('../custom_modules/verifyHMAC.js');



/* GET users listing. */
router.post('/', function(req, res, next) {
  if (verifyHMAC(req.headers.referer,true)){
    var postData = req.body;
    console.log(postData.newProduct)
    const { productID, title, image, price, handle } = postData.newProduct;

    postData.store = req.session.shop;
    var query = {
      forProduct:postData.productID,
      order: postData.order,
      store:postData.store
    };
    var newData = {
      productID,
      title,
      image,
      price,
      handle,
    }

    rpModel.findOneAndUpdate(query, newData, {upsert:false}, function(err, doc){
        if (err) return res.send(500, { error: err });
        return res.send("succesfully saved");
    });
  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }


  });

router.get('/', function(req,res,next){
  if (verifyHMAC(req.headers.referer,true)){
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
    } else {
      res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
    }
  })

router.post('/multiple',function(req,res,next){
  if (verifyHMAC(req.headers.referer,true)){
      const { products, order,productID,title,image,ow,price,handle } = req.body;
      console.log('handle',handle)
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
        handle,
      }

      rpModel.update(queryData,updateData,{multi:true},function(err,doc){
        console.log(err,doc)
        res.send('worked')
      })
  } else {
    res.send('Cannot validate request is coming from shopify. If you are receiving this message in error, please email the developer at robertmozeika20@gmail.com')
  }
})


module.exports = router;
