var mongoose = require('mongoose');
var Schema = require('mongoose').Schema;

var Service = new Schema({
    name: String,
    price: Number,
    details: String,
    validity: Number,
    varientId: String,
    validityKM: Number
}, {
    timestamp: true
})

module.exports = mongoose.model('Service', Service)