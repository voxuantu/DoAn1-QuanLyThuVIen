const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    publishedYear:{
        type: Number,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Author'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    pageCount:{
        type: Number,
        required: true
    },
    bookPublisher:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'BookPublisher'
    },
    coverPrice:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    coverImage:{
        type: String,
        required: true
    }
})

module.exports  = mongoose.model('Book', bookSchema);