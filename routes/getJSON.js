var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

var myjson = {
  author: "audrey hepborn",
  book: [{title: "to kill a mockingbird"}, {title: "great gatsby"}]
}
/* GET users listing. */
router.post('/', function(req, res, next) {
  var query = req.body;
  console.log(query)
  res.send(query)
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

router.get('/test', function(req, res, next){
  req.session.lastNight = 'session test';
  router.test = 'variable test';
  res.send('test')
})

router.get('/rest', function(req, res, next){
  req.session.lastNight = '/rest';
  res.send('rest')

})

router.get('/pest', function(req, res, next){
  console.log(req.session)
  res.send(req.session.lastNight)
})

router.get('/lest', function(req, res, next){
  console.log(req.session)
  res.send(router.test)
})

module.exports = router;
