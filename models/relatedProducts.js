var mongoose = require('mongoose');

var rpSchema = mongoose.Schema({
  productID: String,
  forProduct: String,
  title: String,
  order: Number,
  store: String,
  image: String,
  locked: Boolean,
  price: String,

}, {collection:'RelatedProducts'})

module.exports = mongoose.model('RelatedProducts', rpSchema)
