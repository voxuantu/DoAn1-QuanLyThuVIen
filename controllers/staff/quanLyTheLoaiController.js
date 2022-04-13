const Category = require('../../models/category')
const urlHelper = require('../../utils/url')

class QuanLyTheLoaiController {
    async index(req, res) {
        const currentUser = await req.user
        const categories = await Category.find({})
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            //console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                //console.log('user disconnected');
            });
        });
        res.render('staff/quanLyTheLoai', {
            currentUser: currentUser,
            categories: categories
        })
    }
    async create(req, res) {
        try {
            const category = new Category({
                name: req.body.categoryName
            })
            await category.save()
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTheLoai',{
                type: 'success',
                title: 'Thành công',
                text: 'Thêm thể loại thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idTheLoai = req.body.idLoai
            var tenTheLoai = req.body.tenLoai
            await Category.findOneAndUpdate({ _id: idTheLoai }, { name: tenTheLoai })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTheLoai',{
                type: 'success',
                title: 'Thành công',
                text: 'Sửa thể loại thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req, res) {
        try {
            var id = req.body.id
            await Category.deleteOne({ _id: id })
            req.session.xoaThanhCong = true
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTheLoai',{
                type: 'success',
                title: 'Thành công',
                text: 'Xóa thể loại thành công!'
            })
            res.json(redirectUrl)
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyTheLoaiController