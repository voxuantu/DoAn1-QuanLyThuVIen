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
                    var roomName = currentUser._id.toString()
                    socket.join(roomName)
                }
                console.log(socket.rooms);

                socket.on('disconnect', () => {
                    console.log('user disconnected');
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
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idNbx = req.body.idNbx
            var tenNbx = req.body.tenNbx
            await BookPublisher.findOneAndUpdate({ _id: idNbx }, { name: tenNbx })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhaXuatBan', {
                type: 'success',
                title: 'Thành công',
                text: 'Sửa nhà xuất bản thành công!'
            })
            res.redirect(redirectUrl)
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