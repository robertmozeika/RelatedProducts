var express = require('express');
var router = express.Router();
const FinAuth = require('../custom_modules/FinAuth.js')

// Again assuming you are using the express framework
/* GET users listing. */

//where shopify routes to after authentification from '/' or index.js
router.get('/', FinAuth)


module.exports = router;
