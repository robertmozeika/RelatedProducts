var express = require('express');
var router = express.Router();
var shopModel = require('../models/shops.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  var header = req.query.header;
  shopModel.update({name: req.session.shop},{$set:{header: header}})
    .then(function(){
      res.send('update header')
    })

});

module.exports = router;
