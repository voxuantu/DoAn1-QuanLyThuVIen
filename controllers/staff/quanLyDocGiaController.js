const Role = require('../../models/role')
const Account = require('../../models/account')
const LibraryCard = require('../../models/libraryCard')
const bcrypt = require('bcrypt')

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
            console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                console.log('user disconnected');
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
        res.render('staff/themDocGia', {
            currentUser: currentUser
        })
    }
    //Thêm độc giả
    async create(req, res) {
        try {
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
            res.redirect('/quanLyDocGia/1')
        } catch (error) {
            console.log(error)
        }
    }
    //Tìm kiếm độc giả
}

module.exports = new QuanLyDocGiaController;