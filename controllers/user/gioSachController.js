const Book = require('../../models/book')

class GioSachController {
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
}

module.exports = new GioSachController;