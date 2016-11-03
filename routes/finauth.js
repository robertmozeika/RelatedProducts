var express = require('express');
var router = express.Router();
var app = require('../app.js')
var ShopifyObj = require('./shopify.js');
var database = require('./database.js');
var index = require('./index');
var renderMain = require('./renderMain.js')


// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){


renderMain(res);



});

module.exports = router;
