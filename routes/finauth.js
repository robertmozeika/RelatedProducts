var express = require('express');
var router = express.Router();
var renderMain = require('../custom_modules/renderMain.js')


// Again assuming you are using the express framework
/* GET users listing. */

router.get('/', function(req, res){


renderMain(res)



});

module.exports = router;
