const Role = require('../../models/role')
const Account = require('../../models/account')
const LibraryCard = require('../../models/libraryCard')
const bcrypt = require('bcrypt')

class QuanLyDocGiaController {
    //Load trang quản lý độc giả
    async index(req,res){
        var perPage = 10
        var page = req.params.page || 1

        var cart = req.session.cart
        const currentUser = await req.user
        LibraryCard.find({})
            .populate('accountId')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, readers) {
                LibraryCard.count().exec(function (err, count) {
                    if (err) return next(err)
                    res.render('staff/quanLyDocGia', {
                        cart: cart,
                        currentUser: currentUser,
                        readers: readers,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        cart: cart
                    });
                })
            })
    }
    //Load trang thêm độc giả
    async loadCreate(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
       res.render('staff/themDocGia',{
           cart: cart,
           currentUser: currentUser
       })
    }
    //Thêm độc giả
    async create(req, res){
        try {
            const roleUser = await Role.findOne({name: 'USER'})
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const account = new Account({
                username: req.body.username,
                password: hashPassword,
                displayName: req.body.displayName,
                address: req.body.address,
                phone: req.body.phone,
                gender: req.body.gender,
                birth: new Date(req.body.birth),
                email: req.body.email,
                role: roleUser.id
            })
            if(req.body.gender == 1){
                account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313324/fhrml4yumdl42kk88jll.jpg' 
            }else if(req.body. gender == 0){
                account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313381/femaleAvatar_klsqxv.jpg'
            }
            const newAccount = await account.save()
            const newLibraryCard = new LibraryCard({
                accountId: newAccount.id,
                createdDate: new Date()
            })
            await newLibraryCard.save()
            res.redirect('/quanLyDocGia/1')
        } catch (error) {
            console.log(error)
        }
    }
    //Tìm kiếm độc giả
}

module.exports = new QuanLyDocGiaController;