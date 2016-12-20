var mongoose = require('mongoose');

var bpSchema = mongoose.Schema({
  productID: String,
  forProduct: String,
  title: String,
  howMany: Number,
  forStore: String,
  image: String,

}, {collection:'alsoBoughtProducts'})

module.exports = mongoose.model('alsoBoughtProducts', bpSchema)
