const Book = require('../../models/book')
const Regulation = require('../../models/regulation')
const LibraryCard = require('../../models/libraryCard')
const BorrowBookTicket = require('../../models/borrowBookTicket')
const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')

class GioSachController {
    //Load trang giỏ sách
    async index(req,res){
        const currentUser = await req.user
        var cart = []
        var bookCart = []
        if(req.session.cart){
            cart = req.session.cart
            for(const itemCart of cart){
                const book = await Book.findById(itemCart)
                bookCart.push(book)
            }
        }
        var isDeleted = req.session.isDeleted
        req.session.isDeleted = false
        res.render('user/gioSach',{
            currentUser: currentUser,
            cart: cart,
            bookCart: bookCart,
            isDeleted: isDeleted
        });
        //res.json(bookCart)
    }
    //Thêm sách vào giỏ
    async addBookToCart(req,res){
        let MaxBookBorrow
        try {
            MaxBookBorrow = await Regulation.findOne({name: 'Số sách mươn tối đa/1 lần mượn'})
        } catch (error) {
            console.log(error)
        }
        var isExist = false
        var isMaxBook = false
        var cart = []; 
        if(!req.session.cart){
            cart.push(req.body.id)
            req.session.cart = cart
        }else{
            if(req.session.cart.length < MaxBookBorrow.value){
                req.session.cart.forEach(itemCart => {
                    if(itemCart == req.body.id){
                        isExist = true
                    }
                    cart.push(itemCart)
                });
                if(isExist == false){
                    cart.push(req.body.id);
                }
                req.session.cart = cart
            }else{
                isMaxBook = true
            }
            
        }
        console.log(req.session.cart)
        console.log(req.session.cart.length)
        console.log(MaxBookBorrow.value)
        //res.redirect('back')
        if(!isMaxBook){
            if(isExist == true){
                res.json({
                    message: 'That bai',
                    cartQuantity: req.session.cart.length
                })
            }else{
                res.json({
                    message: 'Thanh cong',
                    cartQuantity: req.session.cart.length
                }) 
            }
        }else{
            res.json({
                message: 'Gio da day',
                cartQuantity: req.session.cart.length
            })
        }
        //console.log(req)
    }
    //Xóa 1 sách ra khỏi giỏ
    deleteBookFromCart(req,res){
        var cart = req.session.cart
        const index = cart.indexOf(req.body.id)
        if(index > -1){
            cart.splice(index,1)
            req.session.cart = cart
            req.session.isDeleted = true
            res.json('Thanh cong')
        }else{
            res.json('That bai')
        }
    }
    //Xóa hết sách ra khỏi giỏ
    deleteAllBookFromCart(req,res){
        var cart = []
        req.session.cart = cart
        req.session.isDeleted = true
        res.redirect('/gioSach')
    }
    //Mượn sách
    async borrowBook(req,res){
        const cart = await req.session.cart
        const currentUser = await req.user
        const numberOfExpirationDays = await Regulation.findOne({name: 'Hạn sử dụng thẻ thư viện ( ngày )'})
        const libraryCard = await LibraryCard.findOne({accountId: currentUser.id})
        var expiredDate = new Date(libraryCard.createdDate)
        expiredDate.setDate(expiredDate.getDate() + numberOfExpirationDays.value)
        var dateNow = new Date()
        if(expiredDate > dateNow){
            var borrorBookTicket = new BorrowBookTicket({
                dateBorrow: new Date(),
                libraryCard : libraryCard
            })
            const newBorrowBookTicket = await borrorBookTicket.save()
            cart.forEach(async (book) => {
                var detailBorrowBookTicket = new DetailBorrowBookTicket({
                    bookId: book,
                    borrowBookTicketId: newBorrowBookTicket.id
                })
                await detailBorrowBookTicket.save()
            });
            var newCart = []
            req.session.cart = newCart
            res.redirect('/trangChu/1')
        }else{
            res.json('the het han su dung')
        }
    }
}

module.exports = new GioSachController;