const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userschema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String,
        default: 'avatar.png',
        required : false
    },
    userFile : {
        type : String,
        required: false,
        default: 'undefined',
    }
})

const userModel = mongoose.model('User', userschema)

module.exports = userModel