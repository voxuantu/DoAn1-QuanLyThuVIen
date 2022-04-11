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
    watched: {
        type: Boolean,
        default : false
    }
})

module.exports  = mongoose.model('Notification', notificationSchema);