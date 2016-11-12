var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require('mongodb');


var routes = require('./routes/index');
var users = require('./routes/users');
var finauth = require('./routes/finauth');
var addProduct = require('./routes/addproduct.js');
var addLiquid = require('./routes/addLiquid.js');
var getJSON = require('./routes/getJSON.js');
var getRP = require('./routes/getRP.js');
var getAllProducts = require('./routes/getAllProducts.js');
var changeProduct = require('./routes/changeProduct.js')
var exchangetoken = require('./routes/exchange.js');
var changeNumOfRel = require('./routes/changeNumOfRel.js');
var changeDefNum = require('./routes/changeDefaultNum.js');



var app = express();

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
app.use('/users', users);
app.use('/finish_auth', finauth);
app.use('/addProduct', addProduct);
app.use('/addLiquid', addLiquid);
app.use('/getJSON', getJSON);
app.use('/getRP', getRP);
app.use('/getAllProducts', getAllProducts);
app.use('/changeProduct', changeProduct);
app.use('/exchange', exchangetoken);
app.use ("/changeNumOfRel", changeNumOfRel);
app.use ("/changeDefaultNum", changeDefNum)






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
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
