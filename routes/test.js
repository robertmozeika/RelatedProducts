var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname  + "/tester.js");
});

module.exports = router;
