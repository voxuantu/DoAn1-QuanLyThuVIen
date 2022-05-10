const Role = require('../../models/role')
const Account = require('../../models/account')
const bcrypt = require('bcrypt')
const urlHelper = require('../../utils/url')
const sendEmail = require('../../utils/sendEmail')
const {GetHeader, GetFooter} = require('../../utils/email')

class QuanLyNhanVienController {
    //Load trang quản lý nhân viên
    async index(req, res, next) {
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
        const currentUser = await req.user
        var staffs = await Account.aggregate()
            .lookup({
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role',
                let: {
                    roleId: "$role"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$_id", "$$roleId"]
                                    },
                                    {
                                        $in: ["$name", ['ADMIN', 'MOD1', 'MOD2']]
                                    }
                                ]
                            }
                        }
                    }
                ]
            })
            .unwind({
                path: '$role',
                preserveNullAndEmptyArrays: false
            })
        res.render('admin/quanLyNhanVien', {
            currentUser: currentUser,
            staffs: staffs
        });

    }
    //Load trang thêm nhân viên
    async loadCreate(req, res) {
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
        const currentUser = await req.user
        const roles = await Role.find({})
        var staffs = await Account.aggregate()
            .lookup({
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role',
                let: {
                    roleId: "$role"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$_id", "$$roleId"]
                                    },
                                    {
                                        $in: ["$name", ['ADMIN', 'MOD1', 'MOD2']]
                                    }
                                ]
                            }
                        }
                    }
                ]
            })
            .unwind({
                path: '$role',
                preserveNullAndEmptyArrays: false
            })
        var username = 'nhanvien' + staffs.length
        var password = '@NhanVien' + staffs.length
        res.render('admin/themNhanVien', {
            currentUser: currentUser,
            roles: roles,
            username: username,
            password: password
        })
    }
    //Thêm nhân viên
    async create(req, res) {
        try {
            const checkPhone = await Account.findOne({ phone: req.body.phone })
            const checkEmail = await Account.findOne({ email: req.body.email })
            if (checkEmail != null && checkPhone != null) {
                res.json({
                    type: 'That bai',
                    message: 'Số điện thoại và email này đã được sử dụng'
                })
            } else if (checkEmail != null) {
                res.json({
                    type: 'That bai',
                    message: 'Email này đã được sử dụng'
                })
            } else if (checkPhone != null) {
                res.json({
                    type: 'That bai',
                    message: 'Số điện thoại này đã được sử dụng.'
                })
            } else {
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
                    role: req.body.role
                })
                if (req.body.gender == 1) {
                    account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313324/fhrml4yumdl42kk88jll.jpg'
                } else if (req.body.gender == 0) {
                    account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313381/femaleAvatar_klsqxv.jpg'
                }
                const newAccount = await account.save()
                const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhanVien', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Thêm nhân viên thành công! Tài khoản và mật khẩu đã được gửi vô gmail "' + req.body.email + '"'
                })
                //Gửi thông tin tài khoản và mật khẩu cho người dùng
                const subject = 'Thông tin tài khoản và mật khẩu'
                let html = GetHeader()
                html += `
                    <p style="font-size: 14px; line-height: 140%;">✨Ch&agrave;o mừng bạn đến với thư viện của ch&uacute;ng t&ocirc;i.✨</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">T&agrave;i khoản v&agrave; mật khẩu của bạn l&agrave; :</p>
                <ul>
                <li style="font-size: 14px; line-height: 19.6px;">T&agrave;i khoản : <strong>${req.body.username}</strong></li>
                <li style="font-size: 14px; line-height: 19.6px;">Mật khẩu : <strong>${req.body.password}</strong></li>
                </ul>
                <p style="font-size: 14px; line-height: 140%;">Kh&ocirc;ng chia sẽ th&ocirc;ng tin n&agrave;y với bất kỳ ai.</p>
                <p style="font-size: 14px; line-height: 140%;">Ch&uacute;c bạn một ng&agrave;y l&agrave;m việc vui vẻ.</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> `
                html += GetFooter()
                
                sendEmail(req.body.email, subject, html)

                res.json({
                    type: 'Thanh cong',
                    message: redirectUrl
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    //Xóa nhân viên
    async delete(req, res) {
        try {
            var id = req.body.id
            await Account.deleteOne({ _id: id })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyNhanVien', {
                type: 'success',
                title: 'Thành công',
                text: 'Xóa nhân viên thành công!'
            })
            res.json(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new QuanLyNhanVienController;