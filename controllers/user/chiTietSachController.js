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
                                            var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            console.log(socket.rooms);
    
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
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