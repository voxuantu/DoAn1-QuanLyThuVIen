const mongoose = require('mongoose')

const libraryCardSchema = new mongoose.Schema({
    accountId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Account'
    },
    createdDate: {
        type: Date,
        required: true
    },
    idCard : {
        type : String,
        required : true
    }
})

module.exports  = mongoose.model('LibraryCard', libraryCardSchema);