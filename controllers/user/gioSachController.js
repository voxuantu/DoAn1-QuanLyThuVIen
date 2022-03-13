const Book = require('../../models/book')

class GioSachController {
    async index(req,res){
        const currentUser = await req.user
        var cart = req.session.cart
        // const book = await Book.findById('6226ca7d7e93bb2133b897ea')
        //res.json(cart)
        //console.log(cart)
        var bookCart = ['1', '2']
        bookCart.push(1)
        bookCart.push(2)
        cart.forEach(itemCart => {
            let book
            var books = Book.findById(itemCart)
            books.exec(function (err, data) {
                book = {
                    name : data.name,
                    description : data.description
                }
            })
            bookCart.push(book)
        });
        // res.render('user/gioSach',{
        //     currentUser: currentUser,
        //     cart: cart,
        //     bookCart: bookCart
        // });
        res.json(bookCart)
        //res.send('test get data')
    }
}

module.exports = new GioSachController;