const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    dateComment:{
        type: Date,
        required: true
    },
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    reader:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Account'
    },
    starRating:{
        type: Number,
        required: true
    }
})

module.exports  = mongoose.model('Comment', commentSchema);