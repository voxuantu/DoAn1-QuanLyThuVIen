const Category = require('../../models/category')
const BookPublisher = require('../../models/bookPublisher')
const Author = require('../../models/author')
const Book = require('../../models/book')
const { Readable } = require('stream')
const cloudinary = require('cloudinary').v2

const bufferUpload = async (buffer) => {
    return new Promise((resolve, reject) => {
        const writeStream = cloudinary.uploader.upload_stream((err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
        const readStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            },
        });
        readStream.pipe(writeStream);
    });
};

class QuanLySachController {
    async index(req, res) {
        var perPage = 5
        var page = req.params.page || 1

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
                        current : page,
                        pages: Math.ceil(count / perPage)
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
            res.redirect('/quanLySach/1')
        } catch (error) {
            res.json(error)
        }
    }
    async renderCreatePage(req, res) {
        const currentUser = await req.user
        const categories = await Category.find({})
        const bookPublishers = await BookPublisher.find({})
        const authors = await Author.find({})
        res.render('staff/themSuaSach.ejs', {
            currentUser: currentUser,
            categories: categories,
            bookPublishers: bookPublishers,
            authors: authors
        })
    }
}

module.exports = new QuanLySachController