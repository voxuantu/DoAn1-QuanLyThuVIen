const Category = require('../../models/category')
const BookPublisher = require('../../models/bookPublisher')
const Author = require('../../models/author')
const Book = require('../../models/book')
const {bufferUpload} = require('../../utils/uploadImage')

class QuanLySachController {
    async index(req, res) {
        var perPage = 5
        var page = req.params.page || 1

        const them = req.session.themThanhCong
        const sua = req.session.suaThanhCong
        const xoa = req.session.xoaThanhCong

        req.session.themThanhCong = false
        req.session.suaThanhCong = false
        req.session.xoaThanhCong = false

        var cart = req.session.cart
        const currentUser = await req.user
        Book.find({})
            .populate('author')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, books) {
                Book.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('staff/quanLySach', {
                        currentUser: currentUser,
                        books: books,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        cart: cart,
                        themThanhCong : them,
                        suaThanhCong : sua,
                        xoaThanhCong : xoa
                    });
                })
            })
    }
    async create(req, res) {
        const { buffer } = req.file
        try {
            const { secure_url } = await bufferUpload(buffer)
            const book = new Book({
                name: req.body.tensach,
                description: req.body.mota,
                publishedYear: req.body.namxuatban,
                author: req.body.tacgia,
                category: req.body.theloai,
                pageCount: req.body.sotrang,
                bookPublisher: req.body.nhaxuatban,
                coverPrice: req.body.giabia,
                quantity: req.body.soluong,
                coverImage: secure_url
            })
            await book.save();
            req.session.themThanhCong = true
            res.redirect('/quanLySach/1')
        } catch (error) {
            res.json(error)
        }
    }
    async renderCreatePage(req, res) {
        var cart = req.session.cart
        const book = new Book()
        const currentUser = await req.user
        const categories = await Category.find({})
        const bookPublishers = await BookPublisher.find({})
        const authors = await Author.find({})
        res.render('staff/themSach.ejs', {
            book: book,
            currentUser: currentUser,
            categories: categories,
            bookPublishers: bookPublishers,
            authors: authors,
            cart: cart
        })
    }
    async search(req, res) {
        var perPage = 5
        var page = req.params.page || 1

        const currentUser = await req.user

        var kieuTim = req.query.kieuTim
        var tuKhoa = req.query.tuKhoa

        if (kieuTim == 1) {
            Book.find({ name: { $regex: tuKhoa, $options: 'i' } })
                .populate('author')
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function (err, books) {
                    Book.find({ name: { $regex: tuKhoa, $options: 'i' } }).count().exec(function (err, count) {
                        if (err) return next(err)
                        res.render('staff/quanLySach', {
                            currentUser: currentUser,
                            books: books,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        });
                    })
                })
        } else if (kieuTim == 2) {
            const author = await Author.findOne({ name: { $regex: tuKhoa, $options: 'i' } })
            Book.find({ author: author._id })
                .populate('author')
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec(function (err, books) {
                    Book.find({ author: author._id }).count().exec(function (err, count) {
                        if (err) return next(err)
                        res.render('staff/quanLySach', {
                            currentUser: currentUser,
                            books: books,
                            current: page,
                            pages: Math.ceil(count / perPage)
                        });
                    })
                })
        }
    }
    async renderEditPage(req, res) {
        try {
            var cart = req.session.cart
            var id = req.params.id
            const book = await Book.findById(id)
            const currentUser = await req.user
            const categories = await Category.find({})
            const bookPublishers = await BookPublisher.find({})
            const authors = await Author.find({})
            res.render('staff/suaSach.ejs', {
                book: book,
                currentUser: currentUser,
                categories: categories,
                bookPublishers: bookPublishers,
                authors: authors,
                cart: cart
            })
        } catch (error) {
            console.log(error)
        }

    }
    async edit(req, res) {
        let book
        try {
            book = await Book.findById(req.params.id)
            if (req.file != null) {
                const { buffer } = req.file
                const { secure_url } = await bufferUpload(buffer)
                book.coverImage = secure_url
            }
            book.name = req.body.tensach
            book.description = req.body.mota
            book.publishedYear = req.body.namxuatban
            book.author = req.body.tacgia
            book.category = req.body.theloai
            book.pageCount = req.body.sotrang
            book.bookPublisher = req.body.nhaxuatban
            book.coverPrice = req.body.giabia
            book.quantity = req.body.soluong

            await book.save()
            req.session.suaThanhCong = true
            res.redirect('/quanLySach/1')
        } catch (error) {
            console.log(error)
        }
    }
    async delete(req, res) {
        try {
            await Book.deleteOne({ _id: req.body.id })
            req.session.xoaThanhCong = true
            res.json('1')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new QuanLySachController