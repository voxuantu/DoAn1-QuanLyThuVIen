const Token = require('../models/token');
const Account = require('../models/account');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')
const DetailBorrowBookTicket = require('../models/detailBorrowBookTicket')
const BorrowBookTicket = require('../models/borrowBookTicket')
const LibraryCard = require('../models/libraryCard')
const Regulation = require('../models/regulation')
const Book = require('../models/book')
const Category = require('../models/category')
const Author = require('../models/author')
const FineTicket = require('../models/fineTicket')
const urlHelper = require('../utils/url')
const Comment = require("../models/comment")
const Notification = require('../models/notification')
var QRCode = require('qrcode');
const fs = require('fs')
const {GetHeader, GetFooter} = require('../utils/email')


class APIController {
    async LayMa(req, res) {
        try {
            const user = await Account.findById(req.body.id)
            if (!user) {
                return res.status(400).send("Người dùng này không tồn tại!")
            }
            let token = await Token.findOne({ user: user._id })
            if (!token) {
                token = await new Token({
                    user: user._id,
                    token: (Math.random() + 1).toString(36).substring(7)
                }).save()
            }

            const subject = 'Đổi mật khẩu'
            let amp = GetHeader()
            amp += ` <p style="font-size: 14px; line-height: 140%;">Xin ch&agrave;o,</p>
            <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
            <p style="font-size: 14px; line-height: 140%;">M&atilde; bảo mật của bạn l&agrave; : <strong>${token.token}</strong></p>
            <p style="font-size: 14px; line-height: 140%;">Kh&ocirc;ng chia sẽ m&atilde; n&agrave;y cho bất kỳ ai.</p>
            <p style="font-size: 14px; line-height: 140%;">&nbsp;</p> `
            amp += GetFooter()


            sendEmail(user.email, subject, amp)
            res.json('Thanh Cong')
        } catch (error) {
            //res.send("Có lỗi xảy ra trong quá trình gửi mã xác nhận")
            console.log(error)
        }
    }
    async DoiMatKhau(req, res) {
        try {
            const userId = req.body.userId
            const newpass = req.body.newpass
            const code = req.body.code

            const hashPassword = await bcrypt.hash(newpass, 10)

            const user = await Account.findById(userId)
            if (!user) {
                res.json("Người dùng này không tồn tại")
            }

            const token = await Token.findOne({ user: userId })
            if (!token) {
                res.json("Mã đã hết hạn")
            }
            console.log(token)
            if (token.token == code) {
                user.password = hashPassword
                await user.save()
                await token.delete()
                res.json("Thành công")
            } else {
                res.json("Mã không đúng")
            }
        } catch (error) {
            res.json('Đã xảy ra lỗi trong quá trình đổi mật khẩu')
            console.log(error)
        }
    }
    async kiemTraNguoiDung(req, res) {
        try {
            const user = await Account.findOne({ username: req.body.username })
            if (user) {
                res.json(user._id)
            } else {
                res.json("Không tìm thấy user")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async layChiTietPhieuMuon(req, res) {
        try {
            const numberOfRenewals = await Regulation.findOne({ name: 'Số lần gia hạn sách' })
            const numberOfDateToBorrwoBook = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })
            const borrowBookTicket = await BorrowBookTicket.findById(req.body.id)
            const fineForOneBookLatePerDay = await Regulation.findOne({ name: "Số tiền phạt trả sách trễ (1 cuốn/1 ngày)" })
            var fineTicket
            if (borrowBookTicket.fineTicket != null) {
                fineTicket = await FineTicket.findById(borrowBookTicket.fineTicket)
            }
            const bookBorrow = await DetailBorrowBookTicket.find({ borrowBookTicketId: req.body.id }).populate('bookId')
            res.json({
                numberOfRenewals: numberOfRenewals.value,
                borrowBookTicket: borrowBookTicket,
                bookBorrow: bookBorrow,
                fine: fineTicket ? fineTicket.fine : 0,
                fineForOneBookLatePerDay: fineForOneBookLatePerDay.value,
                numberOfDateToBorrwoBook : numberOfDateToBorrwoBook
            })
        } catch (error) {
            console.log(error)
        }

    }
    //Xóa hết sách ra khỏi giỏ
    deleteAllBookFromCart(req, res) {
        var cart = []
        req.session.cart = cart
        req.session.isDeleted = true
        res.redirect('/gioSach')
    }
    async giaHanSash(req, res) {
        try {
            const currentUser = await req.user
            const numberOfExpirationDays = await Regulation.findOne({ name: 'Hạn sử dụng thẻ thư viện ( ngày )' })
            const libraryCard = await LibraryCard.findOne({ accountId: currentUser.id })
            var expiredDate = new Date(libraryCard.createdDate)
            expiredDate.setDate(expiredDate.getDate() + numberOfExpirationDays.value)
            var dateNow = new Date()
            //Tạo lại phiếu mượn sách mới
            if (expiredDate > dateNow) {
                const oldBorrowBookTicket = await BorrowBookTicket.findById(req.body.borrowBookTicketId)
                const sachCanGiaHan = await DetailBorrowBookTicket.find({ borrowBookTicketId: req.body.borrowBookTicketId })
                const numberOfDaysBorrowBook = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })

                var newDateBorrow = new Date(oldBorrowBookTicket.dateBorrow)
                newDateBorrow.setDate(newDateBorrow.getDate() + numberOfDaysBorrowBook.value)


                await BorrowBookTicket.findOneAndUpdate({ _id: req.body.borrowBookTicketId }, { statusBorrowBook: 'Đã trả' })
                await DetailBorrowBookTicket.updateMany(
                    { borrowBookTicketId: req.body.borrowBookTicketId },
                    { status: 'Đã trả', dateGiveBack: newDateBorrow }
                )
                var borrorBookTicket = new BorrowBookTicket({
                    dateBorrow: newDateBorrow,
                    libraryCard: libraryCard,
                    statusBorrowBook: "Đang mượn",
                    numberOfRenewals: 1
                })
                const newBorrowBookTicket = await borrorBookTicket.save()
                sachCanGiaHan.forEach(async (book) => {
                    var detailBorrowBookTicket = new DetailBorrowBookTicket({
                        bookId: book.bookId,
                        borrowBookTicketId: newBorrowBookTicket.id,
                        status: "Đang mượn"
                    })
                    await detailBorrowBookTicket.save()
                });
                const redirectUrl = urlHelper.getEncodedMessageUrl('/trangCaNhan', {
                    type: 'success',
                    title: 'Thành công',
                    text: 'Gia hạn sách thành công!'
                })
                res.redirect(redirectUrl)
            } else {
                const redirectUrl = urlHelper.getEncodedMessageUrl('/trangCaNhan', {
                    type: 'error',
                    title: 'Thất bại',
                    text: 'Thẻ độc giả của bạn đã hết hạn. Vui lòng gia hạn thẻ!'
                })
                res.redirect(redirectUrl)
            }
        } catch (error) {
            console.log(error)
        }

    }
    async layChiTietPhieuTra(req, res) {
        var borrowBookTicketId = req.body.id
        const borrowedBooks = await DetailBorrowBookTicket.find({ borrowBookTicketId: borrowBookTicketId }).populate('bookId')
        var data = []
        var count = 0;
        borrowedBooks.forEach(e => {
            var row = {
                bookName: e.bookId.name,
                img: e.bookId.coverImage,
                state: e.status,
                daveGiveBack: e.dateGiveBack
            }
            data.push(row)
            if (e.status == "Đã trả") {
                count++
            }
        })
        const borrowBookTicket = await BorrowBookTicket.findById(borrowBookTicketId)
        const libraryCard = await LibraryCard.findById(borrowBookTicket.libraryCard).populate('accountId')
        var fineTicket = null
        if (borrowBookTicket.fineTicket != null) {
            fineTicket = await FineTicket.findById(borrowBookTicket.fineTicket)
        }
        res.json({
            borrowedBooks: data,
            reader: libraryCard.accountId.displayName,
            state: borrowBookTicket.status,
            dateBorrow: borrowBookTicket.dateBorrow,
            numberOfBooksBorrowed: borrowedBooks.length,
            numberOfReturnedBooks: count,
            fineMoney: fineTicket ? fineTicket.fine : 0
        })
    }
    //Lấy sách theo load more
    async getBooks(req, res) {
        var page = req.query.page;
        var categoryName = req.query.category;
        var filter = req.query.filter;
        var filterType = req.query.filterType;
        console.log(page)
        console.log(categoryName)
        console.log(filter)
        console.log(filterType)
        if (page == null) {
            page = 1
        }
        try {
            let books
            if (categoryName != null) {
                const category = await Category.findOne({ name: categoryName })
                books = await Book.find({ category: category._id })
                    .populate('author')
                    .skip((12 * page) - 12)
                    .limit(12)
            } else if (filter != null) {
                if (filterType == 1) {
                    books = await Book.find({ name: { $regex: filter, $options: 'i' } })
                        .populate('author')
                        .skip((12 * page) - 12)
                        .limit(12)
                } else if (filterType == 2) {
                    const author = await Author.findOne({ name: { $regex: filter, $options: 'i' } })
                    books = await Book.find({ author: author._id })
                        .populate('author')
                        .skip((12 * page) - 12)
                        .limit(12)
                }
            } else {
                books = await Book.find({})
                    .populate('author')
                    .skip((12 * page) - 12)
                    .limit(12)
            }
            var dataBooks = []
            books.forEach(e => {
                var row = {
                    id: e._id,
                    bookName: e.name,
                    coverImage: e.coverImage,
                    author: e.author.name
                }
                dataBooks.push(row)
            });
            res.json(dataBooks)
        } catch (error) {
            console.log(error)
        }
    }
    //Lấy số lượt mượn sách
    async getNumberOfBorrowBooks(req, res) {
        var type = req.query.type
        console.log(type)
        var data = []
        var labels = []
        let date = new Date()
        console.log('Ngay hien tai: ' + date)
        if (type == 'theo thang') {
            for (let i = 0; i < 12; i++) {
                let begin = date.getFullYear() + '/' + (i + 1) + '/1'
                let end
                if (i < 11) {
                    end = date.getFullYear() + '/' + (i + 2) + '/1'
                } else {
                    end = (date.getFullYear() + 1) + '/1/1'
                }

                let count = await BorrowBookTicket.countDocuments({ dateBorrow: { $gte: begin, $lt: end } })
                data.push(count)
                labels.push('Th' + (i + 1))
            }
        } else if (type == 'trong thang') {
            var isLeapYear = false
            var year = date.getFullYear()
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                isLeapYear = true
            }
            var month = date.getMonth() + 1
            var dates
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    dates = 31
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    dates = 30
                    break;
                case 2:
                    if (isLeapYear) {
                        dates = 29
                    } else {
                        dates = 28
                    }
                    break;
            }
            for (let i = 1; i <= dates; i++) {
                var dateFilter = new Date(date.getFullYear(), date.getMonth(), i)
                var dateFilter1 = new Date(date.getFullYear(), date.getMonth(), (i + 1))
                let count = await BorrowBookTicket.countDocuments({ dateBorrow: { $gte: dateFilter, $lte: dateFilter1 } })
                data.push(count)
                if (date.getDate() == i) {
                    labels.push('Hôm nay')
                } else {
                    labels.push(i)
                }
            }
        } else if (type == 'trong tuan') {
            let monday = new Date()
            switch (date.getDay()) {
                case 0:
                    monday.setDate(date.getDate() - 6)
                    break;
                case 1:
                    monday.setDate(date.getDate())
                    break;
                case 2:
                    monday.setDate(date.getDate() - 1)
                    break;
                case 3:
                    monday.setDate(date.getDate() - 2)
                    break;
                case 4:
                    monday.setDate(date.getDate() - 3)
                    break;
                case 5:
                    monday.setDate(date.getDate() - 4)
                    break;
                case 6:
                    monday.setDate(date.getDate() - 5)
                    break;
                default:
                    break;
            }
            console.log(monday)
            let dateOfMonday = monday.getDate()
            console.log(dateOfMonday)
            for (let i = 0; i < 7; i++) {
                var dateFilter = new Date(date.getFullYear(), date.getMonth(), (dateOfMonday + i))
                var dateFilter1 = new Date(date.getFullYear(), date.getMonth(), (dateOfMonday + i + 1))
                console.log(dateFilter)
                console.log(dateFilter1)
                console.log("----")
                let count = await BorrowBookTicket.countDocuments({ dateBorrow: { $gte: dateFilter, $lt: dateFilter1 } })
                data.push(count)
                switch (i) {
                    case 0:
                        labels.push('Thứ hai')
                        break;
                    case 1:
                        labels.push('Thứ ba')
                        break;
                    case 2:
                        labels.push('Thứ tư')
                        break;
                    case 3:
                        labels.push('Thứ năm')
                        break;
                    case 4:
                        labels.push('thứ sáu')
                        break;
                    case 5:
                        labels.push('Thứ bảy')
                        break;
                    case 6:
                        labels.push('Chủ nhật')
                        break;
                    default:
                        break;
                }
            }
        }
        res.json({
            data: data,
            labels: labels
        })
    }
    //Lấy số tiền phạt theo tháng
    async getFine(req, res) {
        var type = req.query.type
        console.log(type)
        var data = []
        var labels = []
        let date = new Date()
        if (type == 'theo thang') {
            for (let i = 0; i < 12; i++) {
                let begin = date.getFullYear() + '/' + (i + 1) + '/1'
                let end
                if (i < 11) {
                    end = date.getFullYear() + '/' + (i + 2) + '/1'
                } else {
                    end = (date.getFullYear() + 1) + '/1/1'
                }
                let fineTickets = await FineTicket.find({ dateFine: { $gte: begin, $lt: end } })
                var sum = 0
                fineTickets.forEach(e => {
                    sum += e.fine
                });
                data.push(sum)
                labels.push('Th' + (i + 1))
            }
        } else if (type == 'trong thang') {
            var isLeapYear = false
            var year = date.getFullYear()
            if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
                isLeapYear = true
            }
            var month = date.getMonth()
            var dates
            switch (month + 1) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    dates = 31
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    dates = 30
                    break;
                case 2:
                    if (isLeapYear) {
                        dates = 29
                    } else {
                        dates = 28
                    }
                    break;
            }
            for (let i = 1; i <= dates; i++) {
                var dateFilter = new Date(date.getFullYear(), date.getMonth(), i)
                var dateFilter1 = new Date(date.getFullYear(), date.getMonth(), (i + 1))
                let fineTickets = await FineTicket.find({ dateFine: { $gte: dateFilter, $lte: dateFilter1 } })
                var sum = 0
                fineTickets.forEach(e => {
                    sum += e.fine
                });
                data.push(sum)
                if (date.getDate() == i) {
                    labels.push('Hôm nay')
                } else {
                    labels.push(i)
                }
            }
        } else if (type == 'trong tuan') {
            let monday = new Date()
            switch (date.getDay()) {
                case 0:
                    monday.setDate(date.getDate() - 6)
                    break;
                case 1:
                    monday.setDate(date.getDate())
                    break;
                case 2:
                    monday.setDate(date.getDate() - 1)
                    break;
                case 3:
                    monday.setDate(date.getDate() - 2)
                    break;
                case 4:
                    monday.setDate(date.getDate() - 3)
                    break;
                case 5:
                    monday.setDate(date.getDate() - 4)
                    break;
                case 6:
                    monday.setDate(date.getDate() - 5)
                    break;
                default:
                    break;
            }
            console.log(monday)
            let dateOfMonday = monday.getDate()
            console.log(dateOfMonday)
            for (let i = 0; i < 7; i++) {
                var dateFilter = new Date(date.getFullYear(), date.getMonth(), (dateOfMonday + i))
                var dateFilter1 = new Date(date.getFullYear(), date.getMonth(), (dateOfMonday + i + 1))
                let fineTickets = await FineTicket.find({ dateFine: { $gte: dateFilter, $lte: dateFilter1 } })
                var sum = 0
                fineTickets.forEach(e => {
                    sum += e.fine
                });
                data.push(sum)
                switch (i) {
                    case 0:
                        labels.push('Thứ hai')
                        break;
                    case 1:
                        labels.push('Thứ ba')
                        break;
                    case 2:
                        labels.push('Thứ tư')
                        break;
                    case 3:
                        labels.push('Thứ năm')
                        break;
                    case 4:
                        labels.push('thứ sáu')
                        break;
                    case 5:
                        labels.push('Thứ bảy')
                        break;
                    case 6:
                        labels.push('Chủ nhật')
                        break;
                    default:
                        break;
                }
            }
        }
        res.json({
            data: data,
            labels: labels
        })
    }
    //Lấy top 10 sách mượn nhiều nhất trong tuần
    async getTop10OfBorrowedBook(req, res) {
        var data = []
        let date = new Date()
        let monday = new Date()
        switch (date.getDay()) {
            case 0:
                monday.setDate(date.getDate() - 6)
                break;
            case 1:
                monday.setDate(date.getDate())
                break;
            case 2:
                monday.setDate(date.getDate() - 1)
                break;
            case 3:
                monday.setDate(date.getDate() - 2)
                break;
            case 4:
                monday.setDate(date.getDate() - 3)
                break;
            case 5:
                monday.setDate(date.getDate() - 4)
                break;
            case 6:
                monday.setDate(date.getDate() - 5)
                break;
            default:
                break;
        }
        let sunday = new Date()
        switch (date.getDay()) {
            case 0:
                sunday.setDate(date.setDate())
                break;
            case 1:
                sunday.setDate(date.getDate() + 6)
                break;
            case 2:
                sunday.setDate(date.getDate() + 5)
                break;
            case 3:
                sunday.setDate(date.getDate() + 4)
                break;
            case 4:
                sunday.setDate(date.getDate() + 3)
                break;
            case 5:
                sunday.setDate(date.getDate() + 2)
                break;
            case 6:
                sunday.setDate(date.getDate() + 1)
                break;
            default:
                break;
        }
        const chiTietMuonSach = await DetailBorrowBookTicket.find({})
            .populate({
                path: 'borrowBookTicketId',
                match: { dateBorrow: { $gte: monday, $lte: sunday } },
                select: 'dateBorrow'
            })
            .populate('bookId', 'name')
        chiTietMuonSach.forEach(e => {
            var isExist = false
            for (let i = 0; i < data.length; i++) {
                if (data[i].bookName == e.bookId.name) {
                    data[i].count += 1
                    isExist = true
                }
            }
            if (!isExist) {
                var row = {
                    bookName: e.bookId.name,
                    count: 1
                }
                data.push(row)
            }
        });
        res.json({
            'data': data
        })
    }
    //Lấy bình luận theo load more
    async getComments(req, res) {
        var page = req.query.page
        var bookId = req.query.bookId
        if (page == null) {
            page = 1
        }
        const comments = await Comment.find({ bookId: bookId })
            .populate('reader')
            .sort({ dateComment: -1 })
            .skip((4 * page) - 4)
            .limit(4)
        res.json(comments)
    }
    // lấy thông báo cho thủ thư
    async loadNotificationForLibrarian(req, res) {
        var notify = await Notification.find({ watched: false, receiver: null })
        res.json(notify)
    }
    // lấy thông báo cho độc giả
    async loadNotificationForReader(req, res) {
        var currentUser = await req.user
        var notify = await Notification.find({ watched: false, receiver: currentUser._id })
        res.json(notify)
    }
    // check đã đọc thông báo
    async checkNotification(req, res) {
        var id = req.body.id
        var notifiy = await Notification.findOneAndUpdate({ _id: id }, { watched: true })
        if (notifiy != null) {
            res.json("success")
        } else {
            res.json("error")
        }
    }
    // lấy thông tin về 1 cuốn sách
    async getABook(req, res) {
        var id = req.body.id
        var book = await Book.findById(id)
        res.json(book)
    }
    // xác nhận mượn sách
    async bookLoanConfirmation(req, res) {
        try {
            var sachmuon = JSON.parse(req.body.sachmuon)
            var libraryCardId = req.body.libraryCard

            const numberOfExpirationDays = await Regulation.findOne({ name: 'Hạn sử dụng thẻ thư viện ( ngày )' })
            var libraryCard = await LibraryCard.findOne({ idCard: libraryCardId })
            var expiredDate = new Date(libraryCard.createdDate)
            expiredDate.setDate(expiredDate.getDate() + numberOfExpirationDays.value)
            var dateNow = new Date()
            console.log("ngay het han : " + expiredDate)
            console.log("ngay hien tai : " + dateNow)
            if (expiredDate > dateNow) {
                let dangMuon = await BorrowBookTicket.findOne({ libraryCard: libraryCard._id, statusBorrowBook: ["Đang mượn", "Đang xử lý"] })
                if (dangMuon != null) {
                    const redirectUrl = urlHelper.getEncodedMessageUrl('/muonTraSach/choMuonOffline', {
                        type: 'warning',
                        title: 'Thất bại',
                        text: 'Bạn không thể mượn sách vì bạn chưa trả sách của phiếu trước hoặc phiếu trước đang được xử lý.'
                    })
                    var newCart = []
                    req.session.cart = newCart
                    res.json(redirectUrl)
                } else {
                    var borrowTicket = new BorrowBookTicket({
                        libraryCard: libraryCard._id,
                        statusBorrowBook: "Đang mượn",
                        dateBorrow: new Date(),
                    })
                    await borrowTicket.save()
                    sachmuon.forEach(async e => {
                        var detailBorrowBookTicket = new DetailBorrowBookTicket({
                            bookId: e,
                            borrowBookTicketId: borrowTicket._id,
                            status: "Đang mượn"
                        })
                        await detailBorrowBookTicket.save()
                    })
                    const redirectUrl = urlHelper.getEncodedMessageUrl('/muonTraSach/choMuonOffline', {
                        type: 'success',
                        title: 'Thành công',
                        text: 'Xác nhận mượn sách thành công!'
                    })
                    res.json(redirectUrl)
                }
            } else {
                const redirectUrl = urlHelper.getEncodedMessageUrl('/muonTraSach/choMuonOffline', {
                    type: 'error',
                    title: 'Thất bại',
                    text: 'Thẻ thư viện của bạn đã hết hạn. Vui lòng gia hạn thẻ để tiếp tục mượn sách!'
                })
                var newCart = []
                req.session.cart = newCart
    
                res.json(redirectUrl)
            }
        } catch (error) {
            console.log(error)
        }
    }
    // lấy qrcode
    async getQRcode(req, res) {
        var id = req.body.id
        const book = await Book.findById(req.body.id)
        QRCode.toDataURL(id, function (err, url) {
            res.json({
                url: url,
                name: book.name
            })
        })
    }
    // tạo ảnh cho qr code
    async createImageQRcode(req, res) {
        try {
            var id = req.body.id
            console.log(id)
            var name = req.body.name
            const qr = await QRCode.toFile(`./public/images/QRCode/${name}.png`, id);
            res.json('success')
            //console.log(qr)
        } catch (err) {
            console.log(err)
        }
    }
    deleteImageQRcode(req, res) {
        try {
            var name = req.body.name
            var path = `./public/images/QRCode/${name}.png`
            fs.unlinkSync(path)
            res.json('success')
        } catch (error) {
            console.log(error)
        }
    }
    //Lấy số sách bị hư hỏng/mất
    async getLostBook(req, res) {
        var month = req.query.thang - 1
        console.log(month)
        var date = new Date()
        var begin = new Date(date.getFullYear(), month, 1)
        var end = new Date(date.getFullYear(), month + 1, 1)
        console.log('beign ' + begin)
        console.log('end ' + end)
        const lostBook = await DetailBorrowBookTicket.aggregate([
            {
                $match: {
                    status: "Hư hỏng/mất",
                    dateGiveBack: { $gte: begin, $lt: end }
                }
            },
            {
                $group: {
                    _id: "$bookId",
                    count: { $sum: 1 }
                }
            }
        ])
        var sachMat = []
        for (let i = 0; i < lostBook.length; i++) {
            const e = lostBook[i];
            const b = await Book.findById(e._id)
            var row = {
                bookName: b.name,
                lostNumber: e.count
            }
            sachMat.push(row)
        }
        res.json(sachMat)
    }

}
module.exports = new APIController
