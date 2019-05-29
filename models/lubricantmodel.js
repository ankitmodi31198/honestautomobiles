var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

var Lubricant = new Schema({
   name: String,
   price: Number,
   quantity: Number,
   labour: Number,
   validity: Number,
   validityKM: Number,
   varientId: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Lubricant', Lubricant)