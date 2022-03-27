const mongoose = require('mongoose')

const detailBorrowBookSchema = new mongoose.Schema({
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Book'
    },
    borrowBookTicketId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'BorrowBookTicket'
    },
    dateGiveBack:{
        type: Date,
        default: null
    },
    status:{
        type: String,
        required: true,
        default: 'Đang xử lý'
    }
})

module.exports  = mongoose.model('DetailBorrowBook', detailBorrowBookSchema);