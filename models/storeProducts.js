var mongoose = require('mongoose');

var spSchema = mongoose.Schema({
  productID: String,
  productName: String,
  numOfRel: Number,
  store: String,
  image: String,

}, {collection:'StoreProducts'})

module.exports = mongoose.model('StoreProducts', spSchema)
