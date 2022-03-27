const BorrowBookTicket = require('../../models/borrowBookTicket')

class MuonTraSachController {
    async index(req,res){
        const currentUser = await req.user
        const phieuDangXuLy = await BorrowBookTicket.find({statusBorrowBook: 'Đang xử lý'})
                                                    .populate({
                                                        path: 'libraryCard',
                                                        populate:{path: 'accountId'}
                                                    })
        res.render('staff/muonTraSach',{
            currentUser: currentUser
        });
    }
}

module.exports = new MuonTraSachController;