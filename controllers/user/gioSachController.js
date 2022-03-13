const Book = require('../../models/book')

class GioSachController {
    async index(req,res){
        const currentUser = await req.user
        var cart = req.session.cart
        // const book = await Book.findById('6226ca7d7e93bb2133b897ea')
        // res.json(book)
        //console.log(book)
        var bookCart = []
        cart.forEach(itemCart => {
            Book.findById(itemCart).exec(function (err, data) {
                
                console.log(data)
                bookCart.push(data)
            })  
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