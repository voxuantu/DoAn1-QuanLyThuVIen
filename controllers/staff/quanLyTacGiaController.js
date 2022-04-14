const Author = require('../../models/author')
const urlHelper = require('../../utils/url')

class QuanLyNhaXuatBanControler {
    async index(req, res) {
        try {
            var cart = req.session.cart
            const authors = await Author.find({});
            const currentUser = await req.user
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
            res.render('staff/quanLyTacGia', {
                authors: authors,
                currentUser: currentUser
            })
        } catch (err) {
            res.json(error)
        }
    }
    async create(req, res) {
        try {
            var tenTacGia = req.body.tentacgia
            const checkAuthor = await Author.findOne({ name: { $regex: tenTacGia, $options: 'i' } })
            if (checkAuthor != null) {
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia', {
                    type: 'warning',
                    title: 'Thất bại',
                    text: 'Tác giả "' + req.body.tentacgia + '" đã có trong danh sách.'
                })
                res.redirect(redirectUrl)
            } else {
                const author = new Author({
                    name: req.body.tentacgia
                })
                await author.save()
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Thêm tác giả thành công!'
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idTacGia = req.body.idTacGia
            var tenTacGia = req.body.tenTacGia
            let oldAuthor = await Author.findById(idTacGia)
            let checkAuthor = await Author.findOne({ name: { $regex: tenTacGia, $options: 'i' } })
            if (checkAuthor == null || checkAuthor._id.toString() == oldAuthor._id.toString()) {
                await Author.findOneAndUpdate({ _id: idTacGia }, { name: tenTacGia })
                //req.session.suaThanhCong = true
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Sửa tác giả thành công!'
                })
                res.redirect(redirectUrl)
            } else {
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia', {
                    type: 'warning',
                    title: 'Thất bại',
                    text: 'Tác giả "' + tenTacGia + '" đã có trong danh sách.'
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req, res) {
        try {
            var idTacGia = req.body.id
            await Author.deleteOne({ _id: idTacGia })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia', {
                type: 'success',
                title: 'Thành công',
                text: 'Xóa tác giả thành công!'
            })
            res.json(redirectUrl)
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler