const Category = require('../../models/category')

class QuanLyTheLoaiController {
    async index(req, res){
        var cart = req.session.cart
        const currentUser = await req.user
        const categories = await Category.find({})
        res.render('staff/quanLyTheLoai', {
            currentUser : currentUser,
            categories : categories,
            cart: cart
        })
    }
    async create(req, res){
        try {
            const category = new Category({
                name : req.body.categoryName
            })
            await category.save()
            res.redirect('/quanLyTheLoai')
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res){
        try {
            var idTheLoai = req.body.idLoai
            var tenTheLoai = req.body.tenLoai
            await Category.findOneAndUpdate({_id : idTheLoai}, {name : tenTheLoai})
            res.redirect('/quanLyTheLoai')
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req,res){
        try {
            var id = req.body.id
            await Category.deleteOne({_id : id})
            res('1')
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyTheLoaiController