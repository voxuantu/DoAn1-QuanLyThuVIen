const Author = require('../../models/author')
const urlHelper = require('../../utils/url')

class QuanLyNhaXuatBanControler {
    async index(req, res) {
        try {
            var cart = req.session.cart
            const authors = await Author.find({});
            const currentUser = await req.user
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
            const author = new Author({
                name: req.body.tentacgia
            })
            await author.save()
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia',{
                type: 'success',
                title: 'Thành công',
                text: 'Thêm tác giả thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idTacGia = req.body.idTacGia
            var tenTacGia = req.body.tenTacGia
            await Author.findOneAndUpdate({ _id: idTacGia }, { name: tenTacGia })
            //req.session.suaThanhCong = true
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia',{
                type: 'success',
                title: 'Thành công',
                text: 'Sửa tác giả thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req, res) {
        try {
            var idTacGia = req.body.id
            await Author.deleteOne({ _id: idTacGia })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyTacGia',{
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