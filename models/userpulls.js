const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    userPulls: {
        type:Object,
        default:{},
    }
    

},{minimize:false})

module.exports = mongoose.model('User', userSchema)