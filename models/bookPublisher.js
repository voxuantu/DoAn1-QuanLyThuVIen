const mongoose = require('mongoose')

const bookPublisherSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports  = mongoose.model('BookPublisher', bookPublisherSchema);