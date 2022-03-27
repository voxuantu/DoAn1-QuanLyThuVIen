const BorrowBookTicket = require('../../models/borrowBookTicket')
const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')
const Regulation = require('../../models/regulation')


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
            await BorrowBookTicket.findOneAndUpdate({ _id: req.body.borrowBookTicketId },{statusBorrowBook: 'Đang mượn'})
            await DetailBorrowBookTicket.updateMany({borrowBookTicketId: req.body.borrowBookTicketId},{status: 'Đang mượn'})
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
}

module.exports = new MuonTraSachController;