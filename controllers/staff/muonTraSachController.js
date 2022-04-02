const BorrowBookTicket = require('../../models/borrowBookTicket')
const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')
const Regulation = require('../../models/regulation')
const Book = require('../../models/book')
const FineTicket = require('../../models/fineTicket')
const urlHelper = require('../../utils/url')


class MuonTraSachController {
    async index(req,res){
        const currentUser = await req.user
        const phieuDangXuLy = await BorrowBookTicket.find({statusBorrowBook: 'Đang xử lý'})
                                                    .populate({
                                                        path: 'libraryCard',
                                                        populate:{path: 'accountId'}
                                                    })
                                                    .sort({dateBorrow : -1})
        const phieuTraSach = await BorrowBookTicket.find({statusBorrowBook: 'Đang mượn'})
                                                    .populate({
                                                        path: 'libraryCard',
                                                        populate:{path: 'accountId'}
                                                    })
                                                    .sort({dateBorrow : 1})
        const maxBorrowDates = await Regulation.findOne({name: 'Số ngày mượn tối đa/1 lần mượn'})
        res.render('staff/muonTraSach',{
            currentUser: currentUser,
            phieuDangXuLy: phieuDangXuLy,
            phieuTraSach: phieuTraSach,
            maxBorrowDates: maxBorrowDates.value
        });
    }
    //cho mượn sách
    async lendBook(req,res){
        try {
            var detailsBorrowBookTiket = await DetailBorrowBookTicket.find({borrowBookTicketId: req.body.borrowBookTicketId})
            for (let i = 0; i < detailsBorrowBookTiket.length; i++) {
                var book = await Book.findById(detailsBorrowBookTiket[i].bookId)
                if(book.quantity == 0){
                    const redirectUrl = urlHelper.getEncodedMessageUrl('/muonTraSach',{
                        type: 'error',
                        title: 'Thất bại',
                        text: 'Không đủ số lượng sách để mượn!'
                    })
                    return  res.redirect(redirectUrl)
                }
                book.quantity = book.quantity - 1
                await book.save()
                detailsBorrowBookTiket[i].status = 'Đang mượn'
                await detailsBorrowBookTiket[i].save()
            }
            await BorrowBookTicket.findOneAndUpdate({ _id: req.body.borrowBookTicketId },{statusBorrowBook: 'Đang mượn'})
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }
    //từ chối cho mượn sách
    async refuseToLendBook(req,res){
        try {
            await DetailBorrowBookTicket.deleteMany({borrowBookTicketId: req.body.borrowBookTicketId})
            await BorrowBookTicket.deleteOne({_id: req.body.borrowBookTicketId})
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }
    //trả sách
    async giveBookBack(req, res){
        try {
            var now = new Date()
            var sachtra = JSON.parse(req.body.sachtra)
            var borrowTicketId = req.body.borrowTicketId
            sachtra.forEach(async(element) => {
                var detaiBorrow = await DetailBorrowBookTicket.findOne({ bookId : element.id, borrowBookTicketId : borrowTicketId})
                detaiBorrow.status = element.tinhtrang
                detaiBorrow.dateGiveBack = now
                await detaiBorrow.save()
            });
            var tienphat = parseInt(req.body.tienphat)
            if(tienphat > 0){
                var fineTicket = new FineTicket({
                    dateFine : now,
                    fine : tienphat
                })
                fineTicket = await fineTicket.save()

                await  BorrowBookTicket.findOneAndUpdate({_id : borrowTicketId}, {fineTicket : fineTicket._id})
            }
            var sosachmuon = await DetailBorrowBookTicket.find({borrowBookTicketId : borrowTicketId}).count()
            if(sachtra.length == sosachmuon){
                await  BorrowBookTicket.findOneAndUpdate({_id : borrowTicketId}, {statusBorrowBook : "Đã trả"})
            }
            res.json("Trả sách thành công")
        } catch (error) {
            console.log(error)
        }
    }
    
}

module.exports = new MuonTraSachController;