var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

var Parts = new Schema({
   name: String,
   price: Number,
   quantity: Number,
   labour: Number,
   varientId: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Parts', Parts)