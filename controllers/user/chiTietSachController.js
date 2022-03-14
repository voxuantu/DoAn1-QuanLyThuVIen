const Book = require("../../models/book")

class ChiTietSachController {
    async index(req,res){
        try {
            var cart = req.session.cart
            const currentUser = await req.user
            const book = await Book.findById(req.params.id)
                                    .populate('bookPublisher')
                                    .populate('author')
                                    .exec()
            const relatedBooks = await Book.find({category: book.category})
                                            .populate('author')
                                            .limit(4)
            res.render('user/chiTietSach',{
                cart: cart,
                book: book,
                currentUser: currentUser,
                relatedBooks: relatedBooks
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ChiTietSachController;