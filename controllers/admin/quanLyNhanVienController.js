const Role = require('../../models/role')
const Account = require('../../models/account')
const bcrypt = require('bcrypt')

class QuanLyNhanVienController {
    //Load trang quản lý nhân viên
    async index(req, res, next) {
        var perPage = 10
        var page = req.params.page || 1

        var cart = req.session.cart
        const currentUser = await req.user
        Account.aggregate()
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
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function (err, staffs) {
                Account.aggregate()
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
                                            $in: ["$name", ['ADMIN','MOD1','MOD2']]
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
                .count('countRecord').exec(function (err, count) {
                        if (err) return next(err)
                        res.render('admin/quanLyNhanVien', {
                            cart: cart,
                            currentUser: currentUser,
                            staffs: staffs,
                            current: page,
                            pages: Math.ceil(count[0].countRecord/ perPage),
                            cart: cart
                        });
                        //res.json(count[0].countRecord)
                    })
            })
    }
    //Load trang thêm nhân viên
    async loadCreate(req, res) {
        var cart = req.session.cart
        const currentUser = await req.user
        const roles = await Role.find({})
        res.render('admin/themNhanVien', {
            cart: cart,
            currentUser: currentUser,
            roles: roles
        })
    }
    //Thêm nhân viên
    async create(req, res) {
        try {
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
            res.redirect('/quanLyNhanVien/1')
        } catch (error) {
            console.log(error)
        }
    }
    //Tìm kiếm nhân viên
}

module.exports = new QuanLyNhanVienController;