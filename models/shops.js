var mongoose = require('mongoose');

var shopSchema = mongoose.Schema({
  name: String,
  access_token: String,
  defaultNumOfRelated: Number,
  allMostBought: [Boolean],

})

module.exports = mongoose.model('shops', shopSchema)
