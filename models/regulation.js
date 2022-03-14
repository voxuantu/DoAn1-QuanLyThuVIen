const mongoose = require('mongoose')

const regulationSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    value:{
        type: Number,
        required: true
    }
})

module.exports  = mongoose.model('Regulation', regulationSchema);