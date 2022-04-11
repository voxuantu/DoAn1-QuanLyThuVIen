const BorrowBookTicket = require('../../models/borrowBookTicket')
const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')
const Regulation = require('../../models/regulation')
const Book = require('../../models/book')
const FineTicket = require('../../models/fineTicket')
const urlHelper = require('../../utils/url')


class MuonTraSachController {
    async index(req, res) {
        const currentUser = await req.user
        const phieuDangXuLy = await BorrowBookTicket.find({ statusBorrowBook: 'Đang xử lý' })
            .populate({
                path: 'libraryCard',
                populate: { path: 'accountId' }
            })
            .sort({ dateBorrow: -1 })
        const phieuTraSach = await BorrowBookTicket.find({ statusBorrowBook: 'Đang mượn' })
            .populate({
                path: 'libraryCard',
                populate: { path: 'accountId' }
            })
            .sort({ dateBorrow: 1 })
        const phieuDaTraSach = await BorrowBookTicket.find({ statusBorrowBook: ['Đã trả', 'Trễ hẹn'] })
            .populate({
                path: 'libraryCard',
                populate: { path: 'accountId' }
            })
            .sort({ dateBorrow: 1 })
        var data = []
        phieuDaTraSach.forEach(async element => {
            var chiTietMuon = await DetailBorrowBookTicket.find({ borrowBookTicketId: element._id })
            var total = chiTietMuon.length
            var count = 0
            chiTietMuon.forEach(e => {
                if (e.status == "Đã trả") {
                    count++
                }
            })
            var row = {
                borrowBookTicketId: element._id,
                readerName: element.libraryCard.accountId.displayName,
                dateBorrow: element.dateBorrow,
                statusBorrowBook: element.statusBorrowBook,
                numberOfBooksReturnedBack: count,
                numberOfBookBorrowed: total
            }
            data.push(row)
        })
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })
        res.render('staff/muonTraSach', {
            currentUser: currentUser,
            phieuDangXuLy: phieuDangXuLy,
            phieuTraSach: phieuTraSach,
            phieuDaTraSach: data,
            maxBorrowDates: maxBorrowDates.value
        });
        //res.json(data)
    }
    //cho mượn sách
    async lendBook(req, res) {
        try {
            var detailsBorrowBookTiket = await DetailBorrowBookTicket.find({ borrowBookTicketId: req.body.borrowBookTicketId })
            for (let i = 0; i < detailsBorrowBookTiket.length; i++) {
                var book = await Book.findById(detailsBorrowBookTiket[i].bookId)
                if (book.quantity == 0) {
                    const redirectUrl = urlHelper.getEncodedMessageUrl('/muonTraSach', {
                        type: 'error',
                        title: 'Thất bại',
                        text: 'Không đủ số lượng sách để mượn!'
                    })
                    return res.redirect(redirectUrl)
                }
                book.quantity = book.quantity - 1
                await book.save()
                detailsBorrowBookTiket[i].status = 'Đang mượn'
                await detailsBorrowBookTiket[i].save()
            }
            await BorrowBookTicket.findOneAndUpdate({ _id: req.body.borrowBookTicketId }, { statusBorrowBook: 'Đang mượn' })
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }
    //từ chối cho mượn sách
    async refuseToLendBook(req, res) {
        try {
            await DetailBorrowBookTicket.deleteMany({ borrowBookTicketId: req.body.borrowBookTicketId })
            await BorrowBookTicket.deleteOne({ _id: req.body.borrowBookTicketId })
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }
    //trả sách
    async giveBookBack(req, res) {
        try {
            var now = new Date()
            var maxDaysToBorrow = await Regulation.findOne({name : "Số ngày mượn tối đa/1 lần mượn"})
            var sachtra = JSON.parse(req.body.sachtra)
            var borrowTicketId = req.body.borrowTicketId
            sachtra.forEach(async (element) => {
                var detaiBorrow = await DetailBorrowBookTicket.findOneAndUpdate(
                    { bookId: element.id, borrowBookTicketId: borrowTicketId }, {
                    status: element.tinhtrang,
                    dateGiveBack: now
                })
            });
            var tienphat = parseInt(req.body.tienphat)
            if (tienphat > 0) {
                var borrowBookTicket = await BorrowBookTicket.findById(borrowTicketId)
                if (borrowBookTicket.fineTicket == null) {
                    var fineTicket = new FineTicket({
                        dateFine: now,
                        fine: tienphat
                    })
                    fineTicket = await fineTicket.save()
                } else {
                    var fineTicket = await FineTicket.findOneAndUpdate({
                        _id: borrowBookTicket.fineTicket
                    }, {
                        dateFine: now,
                        fine: tienphat
                    })
                }

                await BorrowBookTicket.findOneAndUpdate({ _id: borrowTicketId }, { fineTicket: fineTicket._id })
            }
            var sosachtra = 0
            var sachmuon = await DetailBorrowBookTicket.find({ borrowBookTicketId: borrowTicketId })
            var isLate = false
            var borrowBookTicket = await BorrowBookTicket.findById(borrowTicketId)
            sachmuon.forEach(e => {
                if (e.status != "Đang mượn") {
                    sosachtra++
                }
                var dateGiveBack = new Date(e.dateGiveBack)
                var deadline = new Date(borrowBookTicket.dateBorrow)
                deadline.setDate(deadline.getDate() + maxDaysToBorrow.value)
                if (dateGiveBack > deadline) {
                    isLate = true;
                }
            })
            if (sosachtra == sachmuon.length) {
                await BorrowBookTicket.findOneAndUpdate({ _id: borrowTicketId }, { statusBorrowBook: "Đã trả" })
                if (isLate) {
                    await BorrowBookTicket.findOneAndUpdate({ _id: borrowTicketId }, { statusBorrowBook: "Trễ hẹn" })
                }
            }
            console.log("sach tra : " + sosachtra)
            console.log("sach muon : " + sachmuon.length)
            res.json("Trả sách thành công")
        } catch (error) {
            console.log(error)
        }
    }
    //cho muon offline
    async lendBookOffline(req, res){
        const currentUser = await req.user
        res.render('staff/muonSachOffline',{
            currentUser : currentUser
        })
    }
}

module.exports = new MuonTraSachController;