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
            var tenTheLoai = req.body.categoryName
            let checkCategory = await Category.findOne({name: {$regex: tenTheLoai, $options: 'i'}})
            if(checkCategory != null){
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTheLoai',{
                    type: 'warning',
                    title: 'Thất bại',
                    text: 'Thể loại "'+req.body.categoryName +'" đã có trong danh sách.'
                })
                res.redirect(redirectUrl)
            }else{
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
            }
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idTheLoai = req.body.idLoai
            var tenTheLoai = req.body.tenLoai
            const oldCategory = await Category.findById(idTheLoai)
            const checkCategory = await Category.findOne({name: {$regex: tenTheLoai, $options: 'i'}})
            if(checkCategory == null || checkCategory._id.toString() == oldCategory._id.toString()){
                await Category.findOneAndUpdate({ _id: idTheLoai }, { name: tenTheLoai })
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTheLoai',{
                    type: 'success',
                    title: 'Thành công',
                    text: 'Sửa thể loại thành công!'
                })
                res.redirect(redirectUrl)
            }else{
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTheLoai',{
                    type: 'warning',
                    title: 'Thất bại',
                    text: 'Thể loại "'+tenTheLoai+'" đã có trong danh sách.'
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            console.log(error)
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