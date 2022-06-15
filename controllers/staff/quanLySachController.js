const Category = require('../../models/category')
const BookPublisher = require('../../models/bookPublisher')
const Author = require('../../models/author')
const Book = require('../../models/book')
const { bufferUpload } = require('../../utils/uploadImage')
const urlHelper = require('../../utils/url')
const XLSX = require("xlsx");
const fs = require('fs')


class QuanLySachController {
    async index(req, res) {
        const currentUser = await req.user
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if (currentUser.role.name == 'USER') {
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if (numClients == 0) {
                    socket.join(roomName)
                }
            }

            socket.on('disconnect', () => {
                if (currentUser && currentUser.role.name == 'USER') {
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
            });
        });
        const books = await Book.find({}).populate('author')
        res.render('staff/quanLySach', {
            currentUser: currentUser,
            books: books
        });
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

            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLySach', {
                type: 'success',
                title: 'Thành công',
                text: 'Thêm sách thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            res.json(error)
        }
    }
    async renderCreatePage(req, res) {
        const book = new Book()
        const currentUser = await req.user
        const categories = await Category.find({})
        const bookPublishers = await BookPublisher.find({})
        const authors = await Author.find({})
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if (currentUser.role.name == 'USER') {
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if (numClients == 0) {
                    socket.join(roomName)
                }
            }

            socket.on('disconnect', () => {
                if (currentUser && currentUser.role.name == 'USER') {
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
            });
        });
        res.render('staff/themSach.ejs', {
            book: book,
            currentUser: currentUser,
            categories: categories,
            bookPublishers: bookPublishers,
            authors: authors
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
            var id = req.params.id
            const book = await Book.findById(id)
            const currentUser = await req.user
            const categories = await Category.find({})
            const bookPublishers = await BookPublisher.find({})
            const authors = await Author.find({})
            var io = req.app.get('socketio')
            io.on('connection', (socket) => {
                if (currentUser.role.name == 'USER') {
                    var roomName = currentUser.email

                    const clients = io.sockets.adapter.rooms.get(roomName)
                    const numClients = clients ? clients.size : 0
                    if (numClients == 0) {
                        socket.join(roomName)
                    }
                }

                socket.on('disconnect', () => {
                    if (currentUser && currentUser.role.name == 'USER') {
                        var roomName = currentUser.email
                        socket.leave(roomName)
                    }
                });
            });
            res.render('staff/suaSach.ejs', {
                book: book,
                currentUser: currentUser,
                categories: categories,
                bookPublishers: bookPublishers,
                authors: authors
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

            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLySach', {
                type: 'success',
                title: 'Thành công',
                text: 'Sửa sách thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
    async delete(req, res) {
        try {
            await Book.deleteOne({ _id: req.body.id })

            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLySach', {
                type: 'success',
                title: 'Thành công',
                text: 'Xóa sách thành công!'
            })
            res.json(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
    async readFileExcel(req, res) {
        var workbook = XLSX.readFile(req.file.path);
        var sheet_namelist = workbook.SheetNames;
        var x = 0;
        sheet_namelist.forEach(async (element) => {

            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[x]]);
            xlData.forEach(async (row) => {
                var author = await getAuthorId(row.TacGia)
                var category = await getCategoryId(row.TheLoai)
                var bookPublisher = await getBookPublisherId(row.NhaXuatBan)
                // console.log(author)
                // console.log(category)
                // console.log(bookPublisher)

                var data = {
                    name: row.TenSach,
                    description: row.MoTa,
                    publishedYear: row.NamXuatBan,
                    author: author._id,
                    category: category._id,
                    pageCount: row.SoTrang,
                    bookPublisher: bookPublisher._id,
                    coverPrice: row.GiaBia,
                    quantity: row.SoLuong,
                    coverImage: 'https://res.cloudinary.com/cake-shop/image/upload/v1655173016/BiaSachMau_jrldsh.png'
                }
                // console.log(data)
                Book.insertMany(data,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log(data);
                    }
                })
            })
            x++;
        });
        deleteFielExcel(req.file.filename)
        res.redirect('/quanLySach')
    }
    downloadFielExcel(req, res) {
        var wb = XLSX.utils.book_new();
        Book.find(async (err,data) => {
            if(err){
                console.log(err);
            } else {
                var arr = []
                var temp = JSON.stringify(data)
                temp = JSON.parse(temp)

                for (let i = 0; i < temp.length; i++) {
                    var author = await Author.findById(temp[i].author)
                    var category = await Category.findById(temp[i].category)
                    var bookPublisher = await BookPublisher.findById(temp[i].bookPublisher)

                    var book = {
                        TenSach : temp[i].name,
                        MoTa : temp[i].description,
                        NamXuatBan : temp[i].publishedYear,
                        TacGia : author.name,
                        TheLoai: category.name,
                        SoTrang : temp[i].pageCount,
                        NhaXuatBan : bookPublisher.name,
                        GiaBia : temp[i].coverPrice,
                        SoLuong : temp[i].quantity,
                    }
                    arr.push(book)
                }
                var ws = XLSX.utils.json_to_sheet(arr)
                var down = "./public/uploads/Book.xlsx"
                XLSX.utils.book_append_sheet(wb,ws,'sheet 1')
                XLSX.writeFile(wb,down)
                res.download(down)
            }
        })
    }
}

async function getAuthorId(name){
    var author = await Author.findOne({name : name})
    if(author == null){
        const tempAuthor = new Author({
            name: name
        })
        await tempAuthor.save() 
        //console.log(tempAuthor._id)
        return tempAuthor
    }
    return author
}

function deleteFielExcel(name) {
    try {
        var path = `./public/uploads/${name}`
        fs.unlinkSync(path)
    } catch (error) {
        console.log(error)
    }
}

async function getCategoryId(name){
    var category = await Category.findOne({name : name})
    if(category == null){
        const tempCategory = new Category({
            name: name
        })
        await tempCategory.save() 
        //console.log(tempCategory._id)
        return tempCategory
    }
    return category
}

async function getBookPublisherId(name){
    var bookPublisher = await BookPublisher.findOne({name : name})
    if(bookPublisher == null){
        const tempBookPublisher = new BookPublisher({
            name: name
        })
        await tempBookPublisher.save() 
        //console.log(tempCategory._id)
        return tempBookPublisher
    }
    return bookPublisher
}

module.exports = new QuanLySachController