const Author = require('../../models/author')

class QuanLyNhaXuatBanControler {
    async index(req, res) {
        try {
            var cart = req.session.cart
            const authors = await Author.find({});
            const currentUser = await req.user

            const them = req.session.themThanhCong
            const sua = req.session.suaThanhCong
            const xoa = req.session.xoaThanhCong

            req.session.themThanhCong = false
            req.session.suaThanhCong = false
            req.session.xoaThanhCong = false

            res.render('staff/quanLyTacGia', {
                authors: authors,
                currentUser: currentUser,
                cart: cart,
                themThanhCong: them,
                suaThanhCong: sua,
                xoaThanhCong: xoa
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
            req.session.themThanhCong = true
            res.redirect('/quanLyTacGia')
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idTacGia = req.body.idTacGia
            var tenTacGia = req.body.tenTacGia
            await Author.findOneAndUpdate({ _id: idTacGia }, { name: tenTacGia })
            req.session.suaThanhCong = true
            res.redirect('/quanLyTacGia')
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req, res) {
        try {
            var idTacGia = req.body.id
            await Author.deleteOne({ _id: idTacGia })
            req.session.xoaThanhCong = true
            res('1')
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler