var express = require('express');
var router = express.Router();
var app = require('../app.js')
var ShopifyObj = require('../custom_modules/shopify.js');
var database = require('../custom_modules/database.js');
var index = require('./index');
var renderMain = require('../custom_modules/renderMain.js')


// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){


renderMain(res);



});

module.exports = router;
