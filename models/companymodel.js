var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

var Company = new Schema({
    name: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Company', Company)