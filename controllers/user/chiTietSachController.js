const Book = require("../../models/book")
const Comment = require("../../models/comment")


class ChiTietSachController {
    async index(req,res){
        try {
            var page = 1
            var cart = req.session.cart
            const currentUser = await req.user
            const book = await Book.findById(req.params.id)
                                    .populate('bookPublisher')
                                    .populate('author')
                                    .exec()
            const comments = await Comment.find({bookId: req.params.id})
                                    .populate('reader')
                                    .sort({dateComment: -1})
                                    .skip((4*page)-4)
                                    .limit(4)
            const relatedBooks = await Book.find({category: book.category})
                                            .populate('author')
                                            .limit(4)
                                            var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser && currentUser.role.name == 'USER'){
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if(numClients == 0){
                    socket.join(roomName)
                }
            }
    
            socket.on('disconnect', () => {
                if (currentUser && currentUser.role.name == 'USER') {
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
            });
        });
            res.render('user/chiTietSach',{
                cart: cart,
                book: book,
                currentUser: currentUser,
                comments: comments,
                relatedBooks: relatedBooks
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new ChiTietSachController;