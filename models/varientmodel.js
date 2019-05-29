var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

var Varient = new Schema({
    name: String,
    modelId: String
}, {
    timestamps: true
})

module.exports = mongoose.model('Varient', Varient)