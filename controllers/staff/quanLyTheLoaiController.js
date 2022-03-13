const Category = require('../../models/category')

class QuanLyTheLoaiController {
    async index(req, res) {
        var cart = req.session.cart
        const currentUser = await req.user
        const categories = await Category.find({})

        const them = req.session.themThanhCong
        const sua = req.session.suaThanhCong
        const xoa = req.session.xoaThanhCong

        req.session.themThanhCong = false
        req.session.suaThanhCong = false
        req.session.xoaThanhCong = false

        res.render('staff/quanLyTheLoai', {
            currentUser: currentUser,
            categories: categories,
            cart: cart,
            themThanhCong: them,
            suaThanhCong: sua,
            xoaThanhCong: xoa
        })
    }
    async create(req, res) {
        try {
            const category = new Category({
                name: req.body.categoryName
            })
            await category.save()
            req.session.themThanhCong = true
            res.redirect('/quanLyTheLoai')
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res) {
        try {
            var idTheLoai = req.body.idLoai
            var tenTheLoai = req.body.tenLoai
            await Category.findOneAndUpdate({ _id: idTheLoai }, { name: tenTheLoai })
            req.session.suaThanhCong = true
            res.redirect('/quanLyTheLoai')
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req, res) {
        try {
            var id = req.body.id
            await Category.deleteOne({ _id: id })
            req.session.xoaThanhCong = true
            res('1')
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyTheLoaiController