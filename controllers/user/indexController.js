const Book = require('../../models/book');
const Category = require('../../models/category');

class IndexController {
    async index(req,res){
        var perPage = 12
        var page = req.params.page || 1

        const categories = await Category.find({})
        const currentUser = await req.user

        Book.find({})
            .populate('author')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, books) {
                Book.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('index', {
                        currentUser: currentUser,
                        books: books,
                        categories : categories,
                        current : page,
                        pages: Math.ceil(count / perPage)
                    });
                })
            })
    }
    logout(req, res){
        req.logOut()
        res.redirect('/login')
    }
}

module.exports = new IndexController;