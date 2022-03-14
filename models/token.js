const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Account'
    },
    token : {
        type: String,
        required : true
    }, 
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 3600
    }
})

module.exports  = mongoose.model('Token', tokenSchema);