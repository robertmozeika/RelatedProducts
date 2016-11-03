var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

var myjson = {
  author: "audrey hepborn",
  book: [{title: "to kill a mockingbird"}, {title: "great gatsby"}]
}
/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('test', {
    title: "Test Page",
  products: "Sample"});
});

router.get('/thelist', function(req, rest){
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb:localhost:27017/shopify"
  MongoClient.connect(url, function(err, db){
    if(err){
      console.log('Unable to connect' + err)
    } else {
      console.log('Connection between Database Success');

      var collection = "dog"
    }
  })
})

module.exports = router;
