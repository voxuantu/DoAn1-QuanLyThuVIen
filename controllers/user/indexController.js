const Book = require('../../models/book');
const Category = require('../../models/category');
const Author = require('../../models/author')

class IndexController {
    async index(req,res){
        var perPage = 12
        var page = req.params.page || 1

        const categories = await Category.find({})
        const currentUser = await req.user
        var cart = req.session.cart

        Book.find({})
            .populate('author')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, books) {
                Book.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('index', {
                        cart: cart,
                        currentUser: currentUser,
                        books: books,
                        categories : categories,
                        current : page,
                        categoryName : '',
                        pages: Math.ceil(count / perPage)
                    });
                })
            })
    }
    async filter(req, res){
        var perPage = 12
        var page = req.params.page || 1

        var categoryName = req.params.category
        const categories = await Category.find({})
        const currentUser = await req.user
        const category = await Category.findOne({name : categoryName})
        Book.find({category : category._id})
            .populate('author')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, books) {
                Book.find({category : category._id}).count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('index', {
                        currentUser: currentUser,
                        books: books,
                        categories : categories,
                        categoryName : categoryName,
                        current : page,
                        pages: Math.ceil(count / perPage)
                    });
                })
            })
    }
    logout(req, res){
        req.logOut()
        req.session.destroy();
        res.redirect('/dangNhap')
    }
    async search(req, res){
        var perPage = 12
        var page = req.params.page || 1

        const categories = await Category.find({})
        const currentUser = await req.user

        var kieuTim = req.query.kieuTim
        var tuKhoa = req.query.tuKhoa
        
        if(kieuTim == 1){
            Book.find({name : {$regex: tuKhoa, $options: 'i'}})
            .populate('author')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, books) {
                Book.find({name : {$regex: tuKhoa, $options: 'i'}}).count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('index', {
                        currentUser: currentUser,
                        books: books,
                        categories : categories,
                        categoryName : '',
                        current : page,
                        pages: Math.ceil(count / perPage)
                    });
                })
            })
        } else if(kieuTim == 2){
            const author = await Author.findOne({name : {$regex : tuKhoa, $options : 'i'}})
            Book.find({author : author._id})
            .populate('author')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, books) {
                Book.find({author : author._id}).count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('index', {
                        currentUser: currentUser,
                        books: books,
                        categories : categories,
                        categoryName : '',
                        current : page,
                        pages: Math.ceil(count / perPage)
                    });
                })
            })
        }
    }
    async autocomplete(req,res){
        var regex = new RegExp(req.query["term"],'i')
        var kieuTim = req.query["kieuTim"];
        if(kieuTim == '1'){
            var bookFilter = Book.find({name : regex}, {'name' : 1}).limit(5)
            bookFilter.exec(function(err,data){
                var result = []
                if(!err){
                    if(data && data.length && data.length > 0){
                        data.forEach(b => {
                            let obj = {
                                id : b._id,
                                label : b.name
                            }
                            result.push(obj)
                        })
                    }
                    res.json(result)
                }
            })
        } else if(kieuTim == '2'){
            const authorFilter = Author.find({name : regex}, {'name' : 1}).limit(5)
            authorFilter.exec(function(err,data){
                var result = []
                if(!err){
                    if(data && data.length && data.length > 0){
                        data.forEach(b => {
                            let obj = {
                                id : b._id,
                                label : b.name
                            }
                            result.push(obj)
                        })
                    }
                    res.json(result)
                }
            })
        }
    }
}

module.exports = new IndexController;