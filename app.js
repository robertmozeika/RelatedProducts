var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

global.url = "https://localhost:3000/"
// global.url = "https://simple-related-products.herokuapp.com/"

var app = express();

mongoose.connect('mongodb://robertm:testpass@ds155418.mlab.com:55418/relatedproducts');

mongoose.Promise = global.Promise;

app.use(session({
  secret: '123qwe',
  expires: new Date(Date.now() + (30 * 86400 * 1000)),
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection:mongoose.connection}),

}))

var routes = require('./routes/index');
var install = require('./routes/install');

var users = require('./routes/users');
var finauth = require('./routes/finauth');

var getJSON = require('./routes/getJSON.js');
var exchangetoken = require('./routes/exchange.js');
var changeNR = require('./routes/changeNR.js');
var changeRP = require('./routes/changeRP.js');
var setAllMostBought = require('./routes/setAllMostBought.js');
var refreshAlsoBought = require('./routes/refreshAlsoBought.js');
var refreshProductInfo = require('./routes/refreshProductInfo.js');
var setHeader = require('./routes/setHeader.js');
var changeLock = require('./routes/changeLock.js');
















// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);



app.use('/', routes);
app.use('/install', install);

app.use('/users', users);
app.use('/finish_auth', finauth);

app.use('/getJSON', getJSON);
app.use('/exchange', exchangetoken);
app.use ("/changeNR", changeNR);
app.use ("/changeRP", changeRP);
app.use ("/setAllMostBought", setAllMostBought);
app.use ("/refreshAlsoBought", refreshAlsoBought);
app.use("/refreshProductInfo",refreshProductInfo);
app.use ("/setHeader", setHeader);
app.use ("/changeLock", changeLock);











// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err)
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}



// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err)
  res.render('error', {
    message: err.message,
    error: {}
  });
});

const refreshProductInterval = require('./custom_modules/refreshProductInterval.js')
// setInterval(function() {
//     refreshProductInterval();
// }, 10000); // every 5 minutes (300000)

var http = require("http");
setInterval(function() {
    http.get("http://simple-related-products.herokuapp.com");
}, 300000); // every 5 minutes (300000)



module.exports = app;
