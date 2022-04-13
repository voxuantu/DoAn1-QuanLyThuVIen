const BookPublisher = require('../../models/bookPublisher')
const urlHelper = require('../../utils/url')


class QuanLyNhaXuatBanControler {

    async index(req, res) {
        try {
            const bookPublishers = await BookPublisher.find({});
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
                    if(currentUser && currentUser.role.name == 'USER'){
                        var roomName = currentUser.email
                        socket.leave(roomName)
                    }
                });
            });
            res.render('staff/quanLyNhaXuatBan', {
                bookPublishers: bookPublishers,
                currentUser: currentUser
            })

        } catch (err) {
            res.json(err)
        }
    }
    async create(req, res) {
        try {
            var tenNXB = req.body.tenNhaXB
            const checkBookPublisher = await BookPublisher.findOne({ name: { $regex: tenNXB, $options: 'i' } })
            if (checkBookPublisher != null) {
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhaXuatBan', {
                    type: 'warning',
                    title: 'Thất bại',
                    text: '"' + req.body.tenNhaXB + '" đã có trong danh sách. '
                })
                res.redirect(redirectUrl)
            } else {
                const bookPublisher = new BookPublisher({
                    name: req.body.tenNhaXB
                })
                await bookPublisher.save()
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhaXuatBan', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Thêm nhà xuất bản thành công!'
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idNbx = req.body.idNbx
            var tenNbx = req.body.tenNbx
            let oldBookPublisher = await BookPublisher.findById(idNbx)
            let checkBookPublisher = await BookPublisher.findOne({ name: { $regex: tenNbx, $options: 'i' } })
            if (checkBookPublisher == null || checkBookPublisher._id.toString() == oldBookPublisher._id.toString()) {
                await BookPublisher.findOneAndUpdate({ _id: idNbx }, { name: tenNbx })
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhaXuatBan', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Sửa nhà xuất bản thành công!'
                })
                res.redirect(redirectUrl)
            } else {
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhaXuatBan', {
                    type: 'warning',
                    title: 'Thất bại',
                    text: '"' + tenNbx + '" đã có trong danh sách. '
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req, res) {
        try {
            var id = req.body.id
            await BookPublisher.deleteOne({ _id: id })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhaXuatBan', {
                type: 'success',
                title: 'Thành công',
                text: 'Xóa nhà xuất bản thành công!'
            })
            res.json(redirectUrl)
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler