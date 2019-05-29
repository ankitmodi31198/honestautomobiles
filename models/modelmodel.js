var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

var Model = new Schema({
    name: String,
    companyId: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Model', Model)