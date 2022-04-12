const Book = require('../../models/book');
const Category = require('../../models/category');
const Author = require('../../models/author')

class IndexController {
    async index(req,res){
        var page = 1
        const categories = await Category.find({})
        const currentUser = await req.user
        var cart = req.session.cart
        const books = await Book.find({})
                                .populate('author')
                                .skip((12*page)-12)
                                .limit(12)
        const url = '/api/laySach?&page=';

        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser && currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        res.render('index', {
            cart: cart,
            currentUser : currentUser,
            categories: categories,
            books: books,
            url: url
        })
    }
    async filter(req, res){
        var page = 1
        var cart = req.session.cart
        var categoryName = req.params.category
        const categories = await Category.find({})
        const currentUser = await req.user
        const category = await Category.findOne({name : categoryName})
        const books = await Book.find({category: category._id})
                                        .populate('author')
                                        .skip((12*page)-12)
                                        .limit(12)
        const url = '/api/laySach?category='+categoryName+'&page=';
        res.render('index',{
            cart: cart,
            currentUser: currentUser,
            books: books,
            categories: categories,
            url: url
        })
        
    }
    logout(req, res){
        req.logOut()
        req.session.destroy();
        res.redirect('/dangNhap')
    }
    async search(req, res){
        let page = 1
        var cart = req.session.cart

        const categories = await Category.find({})
        const currentUser = await req.user

        var kieuTim = req.query.kieuTim
        var tuKhoa = req.query.tuKhoa
        let books
        if(kieuTim == 1){
            books = await Book.find({name: {$regex: tuKhoa, $options: 'i'}})
                                            .populate('author')
                                            .skip((12*page)-12)
                                            .limit(12)
        } else if(kieuTim == 2){
            const author = await Author.findOne({name: {$regex: tuKhoa, $options: 'i'}})
            books = await Book.find({author : author._id})
                                    .populate('author')
                                    .skip((12*page)-12)
                                    .limit(12)
        }
        const url = '/api/laySach?filter='+tuKhoa+'&filterType='+kieuTim+'&page=';
        res.render('index',{
            cart: cart,
            currentUser: currentUser,
            books: books,
            categories: categories,
            url: url
        })
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