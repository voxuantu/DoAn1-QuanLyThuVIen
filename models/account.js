const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Role'
    },
    displayName:{
        type: String,
        required: true
    },
    address:{
        type:String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    birth: {
        type: Date,
        required: true
    },
    img: {
        type: String,
        required: true
    }
})

module.exports  = mongoose.model('Account', accountSchema);