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
    addBookToCard(req,res){
        if(!req.session.cart){
            var cart = [];
            cart.push(req.params.id)
            req.session.cart = cart
        }else{
            var isExist = false
            var cart = [];
            req.session.cart.forEach(itemCart => {
                if(itemCart == req.params.id){
                    isExist = true
                }
                cart.push(itemCart)
            });
            if(!isExist){
                cart.push(req.params.id);
            }
            req.session.cart = cart
        }
        console.log(req.session.cart)
        res.redirect('back')
    }
}

module.exports = new ChiTietSachController;