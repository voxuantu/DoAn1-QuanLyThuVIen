const mongoose = require('mongoose')

const borrowBookTicketSchema = new mongoose.Schema({
    dateBorrow:{
        type: Date,
        required: true
    },
    fineTicket:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'FineTicket',
        default: null
    },
    libraryCard:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'LibraryCard'
    },
    statusBorrowBook:{
        type: String,
        required: true,
        default: 'Đang xử lý'
    },
    numberOfRenewals:{
        type: Number,
        default: 0
    }
})

module.exports  = mongoose.model('BorrowBookTicket', borrowBookTicketSchema);