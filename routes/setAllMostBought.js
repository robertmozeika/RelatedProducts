var express = require('express');
var router = express.Router();
var setAll = require('../custom_modules/setAllMostBought.js')

/* GET users listing. */
router.post('/', function(req, res, next) {
  setAll(req.body.checked,req.session.shop).then(function(){
    res.send('respond with a resource');
  })
});

module.exports = router;
