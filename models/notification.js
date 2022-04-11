const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    message : {
        type: String,
        required : true
    }, 
    createdAt : {
        type : Date,
        default : Date.now
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Account'
    },
    watched: {
        type: Boolean,
        default : false
    }
})

module.exports  = mongoose.model('Notification', notificationSchema);