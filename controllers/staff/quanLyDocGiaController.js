const Role = require('../../models/role')
const Account = require('../../models/account')
const LibraryCard = require('../../models/libraryCard')
const bcrypt = require('bcrypt')
const urlHelper = require('../../utils/url')
const sendEmail = require('../../utils/sendEmail')
const Regulation = require('../../models/regulation')
const { GetHeader, GetFooter } = require('../../utils/email');
const XLSX = require("xlsx");
const fs = require('fs')


class QuanLyDocGiaController {
    //Load trang quản lý độc giả
    async index(req, res) {
        const currentUser = await req.user
        var readers = await LibraryCard.aggregate()
            .lookup({
                from: 'accounts',
                localField: 'accountId',
                foreignField: '_id',
                as: 'accountId',
                let: {
                    accountId: "$accountId"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$_id", "$$accountId"]
                                    },
                                    {
                                        $eq: ["$isBlock", false]
                                    }
                                ]
                            }
                        }
                    }
                ]
            })
            .unwind({
                path: '$accountId',
                preserveNullAndEmptyArrays: false
            })
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
            if (currentUser.role.name == 'USER') {
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if (numClients == 0) {
                    socket.join(roomName)
                }
            }
            console.log(socket.rooms);

            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        //const numberOfReader = await LibraryCard.count();
        var username = (await generateAccountAndPassword()).username
        var password = (await generateAccountAndPassword()).password
        res.render('staff/themDocGia', {
            currentUser: currentUser,
            username: username,
            password: password
        })
    }
    //Thêm độc giả
    async create(req, res) {
        var result = await createDocGia(req.body.username, req.body.password, req.body.displayName,
            req.body.address, req.body.phone, req.body.gender, req.body.birth, req.body.email)
        res.json({
            type: result.type,
            message: result.message
        })
    }
    //Chặn độc giả
    async block(req, res) {
        try {
            var id = req.body.id
            await Account.findOneAndUpdate({ _id: id }, { isBlock: true })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia', {
                type: 'success',
                title: 'Thành công',
                text: 'Chặn người dùng thành công!'
            })
            res.json(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
    //Load danh sách độc giả bị chặn
    async loadBlockReader(req, res) {
        try {
            const currentUser = await req.user
            var blockReaders = await LibraryCard.aggregate()
                .lookup({
                    from: 'accounts',
                    localField: 'accountId',
                    foreignField: '_id',
                    as: 'accountId',
                    let: {
                        accountId: "$accountId"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$_id", "$$accountId"]
                                        },
                                        {
                                            $eq: ["$isBlock", true]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                })
                .unwind({
                    path: '$accountId',
                    preserveNullAndEmptyArrays: false
                })
            var io = req.app.get('socketio')
            io.on('connection', (socket) => {
                if (currentUser.role.name == 'USER') {
                    var roomName = currentUser._id.toString()
                    socket.join(roomName)
                }
                //console.log(socket.rooms);

                socket.on('disconnect', () => {
                    //console.log('user disconnected');
                });
            });
            res.render('staff/quanLyTaiKhoanBiChan', {
                currentUser: currentUser,
                blockReaders: blockReaders
            });
        } catch (error) {
            console.log(error)
        }
    }
    //Bỏ chặn độc giả
    async unBlock(req, res) {
        try {
            var id = req.body.id
            await Account.findOneAndUpdate({ _id: id }, { isBlock: false })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia/taiKhoanBiChan', {
                type: 'success',
                title: 'Thành công',
                text: 'Bỏ chặn người dùng thành công!'
            })
            res.json(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
    //Gia hạn thẻ độc giả
    async giaHanThe(req, res) {
        try {
            var libraryCardId = req.body.id
            const libraryCard = await LibraryCard.findById(libraryCardId)
            var hanSuDungThe = await Regulation.findOne({ name: "Hạn sử dụng thẻ thư viện ( ngày )" })
            var date = new Date(libraryCard.createdDate)
            date.setDate(date.getDate() + hanSuDungThe.value)
            libraryCard.createdDate = date
            await libraryCard.save()
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia', {
                type: 'success',
                title: 'Thành công',
                text: 'Gia hạn thẻ thư viện thành công!'
            })
            res.json(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
    //Thêm độc giả từ file excel
    async importReaderFromExcel(req, res) {
        var workbook = XLSX.readFile(req.file.path);
        var sheet_namelist = workbook.SheetNames;
        var errList = []
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_namelist[0]]);
        console.log(xlData.length)
        for (let i = 0; i < xlData.length; i++) {
            var account = await generateAccountAndPassword()
            var displayName = xlData[i].HoTen
            var gender = xlData[i].GioiTinh == 'Nam' ? 1 : 0
            var address = xlData[i].DiaChi
            var phone = '0' + xlData[i].SoDienThoai
            var email = xlData[i].Email
            var birth = ExcelDateToJSDate(xlData[i].NgaySinh).toISOString()

            console.log('ngay sinh : ' + birth);
            var result = await createDocGia(account.username, account.password, displayName,
                address, phone, gender, birth, email)

            if (result.type == 'That bai') {
                var row = {
                    HoTen: displayName,
                    GioiTinh: gender == 1 ? 'Nam' : 'Nữ',
                    DiaChi: address,
                    SoDienThoai: phone,
                    Email: email,
                    NgaySinh: ExcelDateToJSDate(xlData[i].NgaySinh).toDateString(),
                    MoTaLoi: result.message
                }
                errList.push(row)
            }
        }

        deleteFielExcel(req.file.filename)
        if (errList.length > 0) {
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.json_to_sheet(errList)
            var down = "./public/uploads/DanhSachDocGiaLoi.xlsx"
            XLSX.utils.book_append_sheet(wb, ws, 'sheet 1')
            XLSX.writeFile(wb, down)
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia', {
                type: 'warning',
                title: 'Thất bại',
                text: 'Một số độc giả không thể thêm vào hệ thống!'
            })
            res.json({
                type: 'Error',
                url: redirectUrl
            })
        } else {
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia', {
                type: 'success',
                title: 'Thành công',
                text: 'Thêm độc giả từ file Excel thành công!'
            })
            res.json({
                type: 'Success',
                url: redirectUrl
            })
        }
    }
    //Xuất file excel độc giả
    async downloadFielExcel(req, res) {
        var wb = XLSX.utils.book_new();

        var libraryCards = await LibraryCard.find().populate('accountId')

        var arr = []
        var temp = JSON.stringify(libraryCards)
        temp = JSON.parse(temp)

        for (let i = 0; i < temp.length; i++) {
            var account = {
                MaTheThuVien : temp[i].idCard,
                HoTen : temp[i].accountId.displayName,
                DiaChi : temp[i].accountId.address,
                SoDienThoai : temp[i].accountId.phone,
                Email : temp[i].accountId.email,
                NgaySinh : new Date(temp[i].accountId.birth).toDateString(),
                GioiTinh : temp[i].accountId.gender == 1 ? 'Nam' : 'Nữ'
            }
            arr.push(account)
        }
        var ws = XLSX.utils.json_to_sheet(arr)
        var down = "./public/uploads/DanhSachDocGia.xlsx"
        XLSX.utils.book_append_sheet(wb, ws, 'sheet 1')
        XLSX.writeFile(wb, down)
        res.download(down)
    }
}

async function generateAccountAndPassword() {
    const numberOfReader = await LibraryCard.count();
    var username = 'docgia' + numberOfReader
    var password = '@DocGia' + numberOfReader
    return {
        username: username,
        password: password
    }
}

async function createDocGia(username, password, displayName, address, phone, gender, birth, email) {
    try {
        const checkPhone = await Account.findOne({ phone: phone })
        const checkEmail = await Account.findOne({ email: email })
        if (checkEmail != null && checkPhone != null) {
            return {
                type: 'That bai',
                message: 'Số điện thoại và email này đã được sử dụng'
            }
        } else if (checkEmail != null) {
            return {
                type: 'That bai',
                message: 'Email này đã được sử dụng'
            }
        } else if (checkPhone != null) {
            return {
                type: 'That bai',
                message: 'Số điện thoại này đã được sử dụng.'
            }
        } else {
            const roleUser = await Role.findOne({ name: 'USER' })
            const hashPassword = await bcrypt.hash(password, 10)
            const account = new Account({
                username: username,
                password: hashPassword,
                displayName: displayName,
                address: address,
                phone: phone,
                gender: gender,
                birth: new Date(birth),
                email: email,
                role: roleUser.id
            })
            if (gender == 1) {
                account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313324/fhrml4yumdl42kk88jll.jpg'
            } else if (gender == 0) {
                account.img = 'https://res.cloudinary.com/cake-shop/image/upload/v1647313381/femaleAvatar_klsqxv.jpg'
            }
            const newAccount = await account.save()
            const num = await LibraryCard.find({}).count().exec()
            const newLibraryCard = new LibraryCard({
                accountId: newAccount.id,
                createdDate: new Date(),
                idCard: "LBC" + num
            })
            await newLibraryCard.save()
            const redirectUrl = urlHelper.getEncodedMessageUrl('/quanLyDocGia', {
                type: 'success',
                title: 'Thành công',
                text: 'Thêm độc giả thành công! Tài khoản và mật khẩu đã được gửi vô gmail "' + email + '"'
            })
            //Gửi thông tin tài khoản và mật khẩu cho người dùng
            const subject = 'Thông tin tài khoản và mật khẩu'
            let html = GetHeader();
            html += `
                <p style="font-size: 14px; line-height: 140%;">✨Ch&agrave;o mừng bạn đến với thư viện của ch&uacute;ng t&ocirc;i.✨</p>
            <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
            <p style="font-size: 14px; line-height: 140%;">T&agrave;i khoản v&agrave; mật khẩu của bạn l&agrave; :</p>
            <ul>
            <li style="font-size: 14px; line-height: 19.6px;">T&agrave;i khoản : <strong>${username}</strong></li>
            <li style="font-size: 14px; line-height: 19.6px;">Mật khẩu : <strong>${password}</strong></li>
            </ul>
            <p style="font-size: 14px; line-height: 140%;">Kh&ocirc;ng chia sẽ th&ocirc;ng tin n&agrave;y với bất kỳ ai.</p>
            <p style="font-size: 14px; line-height: 140%;">Ch&uacute;c bạn một ng&agrave;y l&agrave;m việc vui vẻ.</p>
            <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> `
            html += GetFooter()

            sendEmail(email, subject, html)

            return {
                type: 'Thanh cong',
                message: redirectUrl
            }
        }
    } catch (error) {
        console.log(error)
    }
}

function deleteFielExcel(name) {
    try {
        var path = `./public/uploads/${name}`
        fs.unlinkSync(path)
    } catch (error) {
        console.log(error)
    }
}

function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

module.exports = new QuanLyDocGiaController;