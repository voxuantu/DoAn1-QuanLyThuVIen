const Category = require('../../models/category')

class QuanLyTheLoaiController {
    async index(req, res){
        const currentUser = await req.user
        const categories = await Category.find({})
        res.render('staff/quanLyTheLoai', {
            currentUser : currentUser,
            categories : categories
        })
    }
    async create(req, res){
        try {
            const category = new Category({
                name : req.body.categoryName
            })
            await category.save()
            res.json('Them Thanh Cong')
        } catch (error) {
            res.json(error)
        }
    }
}

module.exports = new QuanLyTheLoaiController