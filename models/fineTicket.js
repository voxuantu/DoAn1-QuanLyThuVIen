const mongoose = require('mongoose')

const fineTicketSchema = new mongoose.Schema({
    dateFine:{
        type: Date,
        required: true
    },
    fine:{
        type: Number,
        required: true
    }
})

module.exports  = mongoose.model('FineTicket', fineTicketSchema);