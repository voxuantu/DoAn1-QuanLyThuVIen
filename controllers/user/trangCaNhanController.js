const { bufferUpload } = require('../../utils/uploadImage')
const Account = require('../../models/account')
const BorrowBookTicket = require('../../models/borrowBookTicket')
const Regulation = require('../../models/regulation')
const LibraryCard = require('../../models/libraryCard')
const Comment = require("../../models/comment")
const urlHelper = require("../../utils/url")
const DetailBorrowBookTicket = require("../../models/detailBorrowBookTicket")
const Book = require("../../models/book")

class TrangCaNhanController {
    async index(req, res) {
        const currentUser = await req.user
        if (currentUser.role.name == 'USER') {
            const libraryCard = await LibraryCard.findOne({ accountId: currentUser._id })
            var cart = req.session.cart
            const borrowBookCard = await BorrowBookTicket.aggregate().match({ libraryCard: libraryCard._id }).lookup({
                from: 'detailborrowbooks',
                localField: '_id',
                foreignField: 'borrowBookTicketId',
                as: 'bookBorrowed'
            })
            const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })

            var io = req.app.get('socketio')
            io.on('connection', (socket) => {
                if (currentUser.role.name == 'USER') {
                    var roomName = currentUser.email

                    const clients = io.sockets.adapter.rooms.get(roomName)
                    const numClients = clients ? clients.size : 0
                    if (numClients == 0) {
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

            res.render('user/trangCaNhan', {
                currentUser: currentUser,
                cart: cart,
                borrowBookCard: borrowBookCard,
                maxBorrowDates: maxBorrowDates.value
            });
        } else {
            res.render('staff/trangCaNhanStaff', {
                currentUser: currentUser
            })
        }
    }

    //update user
    async update(req, res) {
        //res.send('test edit user')
        let user
        try {
            user = await Account.findById(req.params.id)
            if (req.file != null) {
                const { buffer } = req.file;
                const { secure_url } = await bufferUpload(buffer);
                user.img = secure_url
            }
            user.displayName = req.body.displayName,
                user.address = req.body.address,
                user.email = req.body.email,
                user.phone = req.body.phone,
                user.birth = new Date(req.body.birth)

            await user.save()
            res.redirect('/trangCaNhan')
        } catch (error) {
            console.log(error)
            res.send("Something went wrong please try again later..");
        }
    }
    //Bình luận sách
    async commentBook(req, res) {
        try {
            const currentUser = await req.user
            var comment = new Comment({
                content: req.body.content,
                starRating: req.body.starRating,
                dateComment: new Date(),
                bookId: req.body.bookId,
                reader: currentUser.id
            })
            await comment.save()
            await DetailBorrowBookTicket.findOneAndUpdate({ _id: req.body.detailBorrowBookId }, { isComment: true })
            const comments = await Comment.find({ bookId: req.body.bookId })
            var starRating = 0
            comments.forEach(e => {
                starRating += e.starRating
            });
            starRating /= comments.length;
            await Book.findOneAndUpdate({ _id: req.body.bookId }, { starRating: starRating })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/chiTietSach/' + req.body.bookId, {
                type: 'success',
                title: 'Thành công',
                text: 'Bình luận sách thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new TrangCaNhanController;