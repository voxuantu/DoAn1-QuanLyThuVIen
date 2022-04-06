const Token = require('../models/token');
const Account = require('../models/account');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')
const DetailBorrowBookTicket = require('../models/detailBorrowBookTicket')
const BorrowBookTicket = require('../models/borrowBookTicket')
const LibraryCard = require('../models/libraryCard')
const Regulation = require('../models/regulation')
const Book = require('../models/book')
const Category = require('../models/category')
const Author = require('../models/author')
const urlHelper = require('../utils/url')
const FineTicket = require('../models/fineTicket')

class APIController {
    async LayMa(req, res) {
        try {
            const user = await Account.findById(req.body.id)
            if (!user) {
                return res.status(400).send("Người dùng này không tồn tại!")
            }
            let token = await Token.findOne({ user: user._id })
            if (!token) {
                token = await new Token({
                    user: user._id,
                    token: (Math.random() + 1).toString(36).substring(7)
                }).save()
            }

            const subject = 'Đổi mật khẩu'
            const text = "Mã xác nhận của bạn là : " + token.token

            sendEmail(user.email, subject, text)
            res.json('Thanh Cong')
        } catch (error) {
            //res.send("Có lỗi xảy ra trong quá trình gửi mã xác nhận")
            console.log(error)
        }
    }
    async DoiMatKhau(req, res) {
        try {
            const userId = req.body.userId
            const newpass = req.body.newpass
            const code = req.body.code

            const hashPassword = await bcrypt.hash(newpass, 10)

            const user = await Account.findById(userId)
            if (!user) {
                res.json("Người dùng này không tồn tại")
            }

            const token = await Token.findOne({ user: userId })
            if (!token) {
                res.json("Mã đã hết hạn")
            }
            console.log(token)
            if(token.token == code){
                user.password = hashPassword
                await user.save()
                await token.delete()
                res.json("Thành công")
            } else {
                res.json("Mã không đúng")
            }
        } catch (error) {
            res.json('Đã xảy ra lỗi trong quá trình đổi mật khẩu')
            console.log(error)
        }
    }
    async kiemTraNguoiDung(req, res){
        try {
            const user = await Account.findOne({username : req.body.username})
            if(user){
                res.json(user._id)
            } else {
                res.json("Không tìm thấy user")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async layChiTietPhieuMuon(req,res){
        try {
            const numberOfRenewals = await Regulation.findOne({name: 'Số lần gia hạn sách'})
            const borrowBookTicket = await BorrowBookTicket.findById(req.body.id)
            var fineTicket
            if(borrowBookTicket.fineTicket != null){
                fineTicket = await FineTicket.findById(borrowBookTicket.fineTicket)
            }
            const bookBorrow = await DetailBorrowBookTicket.find({borrowBookTicketId: req.body.id}).populate('bookId')
            res.json({
                numberOfRenewals: numberOfRenewals.value,
                borrowBookTicket: borrowBookTicket,
                bookBorrow: bookBorrow,
                fine : fineTicket ? fineTicket.fine : 0
            })
        } catch (error) {
            console.log(error)
        }

    }
    //Xóa hết sách ra khỏi giỏ
    deleteAllBookFromCart(req,res){
        var cart = []
        req.session.cart = cart
        req.session.isDeleted = true
        res.redirect('/gioSach')
    }
    async giaHanSash(req,res){
        try {
            const currentUser = await req.user
            const numberOfExpirationDays = await Regulation.findOne({name: 'Hạn sử dụng thẻ thư viện ( ngày )'})
            const libraryCard = await LibraryCard.findOne({accountId: currentUser.id})
            var expiredDate = new Date(libraryCard.createdDate)
            expiredDate.setDate(expiredDate.getDate() + numberOfExpirationDays.value)
            var dateNow = new Date()
           //Tạo lại phiếu mượn sách mới
            if(expiredDate > dateNow){
                const oldBorrowBookTicket = await BorrowBookTicket.findById(req.body.borrowBookTicketId)
                const sachCanGiaHan = await DetailBorrowBookTicket.find({borrowBookTicketId: req.body.borrowBookTicketId})    
                const numberOfDaysBorrowBook = await Regulation.findOne({name: 'Số ngày mượn tối đa/1 lần mượn'})

                var newDateBorrow = new Date(oldBorrowBookTicket.dateBorrow)
                newDateBorrow.setDate(newDateBorrow.getDate() + numberOfDaysBorrowBook.value)


                await BorrowBookTicket.findOneAndUpdate({ _id: req.body.borrowBookTicketId },{statusBorrowBook: 'Đã trả'})
                await DetailBorrowBookTicket.updateMany(
                    {borrowBookTicketId: req.body.borrowBookTicketId},
                    {status: 'Đã trả', dateGiveBack: newDateBorrow }
                )
                var borrorBookTicket = new BorrowBookTicket({
                    dateBorrow: newDateBorrow,
                    libraryCard : libraryCard,
                    statusBorrowBook: "Đang mượn",
                    numberOfRenewals: 1
                })
                const newBorrowBookTicket = await borrorBookTicket.save()
                sachCanGiaHan.forEach(async (book) => {
                    var detailBorrowBookTicket = new DetailBorrowBookTicket({
                        bookId: book.bookId,
                        borrowBookTicketId: newBorrowBookTicket.id,
                        status: "Đang mượn"
                    })
                    await detailBorrowBookTicket.save()
                });
                const redirectUrl = urlHelper.getEncodedMessageUrl('/trangCaNhan',{
                    type: 'success',
                    title: 'Thành công',
                    text: 'Gia hạn sách thành công!'
                })
                res.redirect(redirectUrl)
            }else{
                const redirectUrl = urlHelper.getEncodedMessageUrl('/trangCaNhan',{
                    type: 'error',
                    title: 'Thất bại',
                    text: 'Thẻ độc giả của bạn đã hết hạn. Vui lòng gia hạn thẻ!'
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            console.log(error)
        }

    }
    async layChiTietPhieuTra(req, res){
        var borrowBookTicketId = req.body.id
        const borrowedBooks = await DetailBorrowBookTicket.find({borrowBookTicketId : borrowBookTicketId}).populate('bookId')
        var data = []
        var count = 0;
        borrowedBooks.forEach(e => {
            var row = {
                bookName : e.bookId.name,
                img : e.bookId.coverImage,
                state : e.status,
                daveGiveBack : e.dateGiveBack
            }
            data.push(row)
            if(e.status == "Đã trả"){
                count++
            }
        })
        const borrowBookTicket = await BorrowBookTicket.findById(borrowBookTicketId)
        const libraryCard = await LibraryCard.findById(borrowBookTicket.libraryCard).populate('accountId')
        var fineTicket = null
        if(borrowBookTicket.fineTicket != null){
            fineTicket = await FineTicket.findById(borrowBookTicket.fineTicket)
        }
        res.json({
            borrowedBooks : data,
            reader : libraryCard.accountId.displayName,
            state : borrowBookTicket.status,
            dateBorrow : borrowBookTicket.dateBorrow,
            numberOfBooksBorrowed : borrowedBooks.length,
            numberOfReturnedBooks : count,
            fineMoney : fineTicket ? fineTicket.fine : 0
        })
    //Lấy sách theo load more
    async getBooks(req, res){
        var page = req.query.page;
        var categoryName = req.query.category;
        var filter = req.query.filter;
        var filterType = req.query.filterType;
        console.log(page)
        console.log(categoryName)
        console.log(filter)
        console.log(filterType)
        if(page == null){
            page = 1
        }
        try {
            let books
            if(categoryName != null){
                const category = await Category.findOne({name: categoryName})
                books = await Book.find({category: category._id})
                                        .populate('author')
                                        .skip((12*page)-12)
                                        .limit(12)
            }else if(filter != null){
                if(filterType == 1){
                    books = await Book.find({name: {$regex: filter, $options: 'i'}})
                                            .populate('author')
                                            .skip((12*page)-12)
                                            .limit(12)
                }else if(filterType == 2){
                    const author = await Author.findOne({name: {$regex: filter, $options: 'i'}})
                    books = await Book.find({author : author._id})
                                            .populate('author')
                                            .skip((12*page)-12)
                                            .limit(12)
                }
            }else{
                books = await Book.find({})
                                        .populate('author')
                                        .skip((12*page)-12)
                                        .limit(12)
            }
            var dataBooks = []
            books.forEach(e => {
                var row = {
                    id: e._id,
                    bookName: e.name,
                    coverImage: e.coverImage,
                    author: e.author.name
                }
                dataBooks.push(row)
            });
            res.json(dataBooks)
        } catch (error) {
            console.log(error)   
        }
    }
}

module.exports = new APIController