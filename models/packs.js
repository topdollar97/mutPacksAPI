const mongoose = require("mongoose");

const packSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    avgOverall: {
        type: Number,
        default: 80
    },
    picLocation: String,
    author: String,
    highestovr: Number,
    lowestovr: Number,
    pulls: {
        type:Object,
        default:{},
    }
    

},{minimize:false})

module.exports = mongoose.model('Pack', packSchema)
