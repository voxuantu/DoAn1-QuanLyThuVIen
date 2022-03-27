const BorrowBookTicket = require('../../models/borrowBookTicket')

class MuonTraSachController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        const phieuDangXuLy = await BorrowBookTicket.find({statusBorrowBook: 'Đang xử lý'})
                                                    .populate({
                                                        path: 'libraryCard',
                                                        populate:{path: 'accountId'}
                                                    })
        res.render('staff/muonTraSach',{
            currentUser: currentUser,
            cart: cart,
            phieuDangXuLy: phieuDangXuLy
        });
    }
}

module.exports = new MuonTraSachController;