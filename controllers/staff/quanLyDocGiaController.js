const Role = require('../../models/role')
const Account = require('../../models/account')
const LibraryCard = require('../../models/libraryCard')
const bcrypt = require('bcrypt')
const urlHelper = require('../../utils/url')
const sendEmail = require('../../utils/sendEmail')


class QuanLyDocGiaController {
    //Load trang quản lý độc giả
    async index(req, res) {
        const currentUser = await req.user
        var readers = await LibraryCard.find({}).populate('accountId')
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            //console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                //console.log('user disconnected');
            });
        });
        res.render('staff/quanLyDocGia', {
            currentUser: currentUser,
            readers: readers
        });
    }
    //Load trang thêm độc giả
    async loadCreate(req, res) {
        const currentUser = await req.user
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        const numberOfReader = await LibraryCard.count();
        var username = 'docgia'+ numberOfReader
        var password = '@DocGia'+numberOfReader
        res.render('staff/themDocGia', {
            currentUser: currentUser,
            username: username,
            password: password
        })
    }
    //Thêm độc giả
    async create(req, res) {
        try {
            const checkPhone = await Account.findOne({phone: req.body.phone})
            const checkEmail = await Account.findOne({email: req.body.email})
            if(checkEmail != null && checkPhone != null){
                res.json({
                    type: 'That bai',
                    message: 'Số điện thoại và email này đã được sử dụng'
                })
            }else if(checkEmail != null){
                res.json({
                    type: 'That bai',
                    message: 'Email này đã được sử dụng'
                })
            }else if(checkPhone != null){
                res.json({
                    type: 'That bai',
                    message: 'Số điện thoại này đã được sử dụng.'
                })
            }else{
                const roleUser = await Role.findOne({ name: 'USER' })
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
                if (req.body.gender == 1) {
                    account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313324/fhrml4yumdl42kk88jll.jpg'
                } else if (req.body.gender == 0) {
                    account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313381/femaleAvatar_klsqxv.jpg'
                }
                const newAccount = await account.save()
                const newLibraryCard = new LibraryCard({
                    accountId: newAccount.id,
                    createdDate: new Date()
                })
                await newLibraryCard.save()
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Thêm độc giả thành công! Tài khoản và mật khẩu đã được gửi vô gmail "'+req.body.email+'"'
                })
                //Gửi thông tin tài khoản và mật khẩu cho người dùng
                const subject = 'Thông tin tài khoản và mật khẩu'
                const text = "Tài khoản thư viện của bạn là :\nUsername: " + req.body.username + "\nPassword: "+ req.body.password
                sendEmail(req.body.email, subject, text)

                res.json({
                    type: 'Thanh cong',
                    message: redirectUrl
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    //Tìm kiếm độc giả
}

module.exports = new QuanLyDocGiaController;