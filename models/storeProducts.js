var mongoose = require('mongoose');

var spSchema = mongoose.Schema({
  productID: String,
  title: String,
  numOfRel: Number,
  store: String,
  image: String,
  handle: String,
  locks: [Boolean],
  price: String,

}, {collection:'StoreProducts'})

module.exports = mongoose.model('StoreProducts', spSchema)
