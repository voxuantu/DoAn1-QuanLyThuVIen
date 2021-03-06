const BorrowBookTicket = require('../../models/borrowBookTicket')
const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')
const Regulation = require('../../models/regulation')
const Book = require('../../models/book')
const FineTicket = require('../../models/fineTicket')
const urlHelper = require('../../utils/url')
const LibraryCard = require('../../models/libraryCard')
const Notification = require('../../models/notification')
const Account = require('../../models/account')
const sendEmail = require('../../utils/sendEmail');
const {GetHeader,GetFooter} = require('../../utils/email')

class MuonTraSachController {
    async index(req, res) {
        const currentUser = await req.user
        const phieuDangXuLy = await BorrowBookTicket.find({ statusBorrowBook: 'Đang xử lý' })
            .populate({
                path: 'libraryCard',
                populate: { path: 'accountId' }
            })
            .sort({ dateBorrow: -1 })
        const phieuTraSach = await BorrowBookTicket.find({ statusBorrowBook: 'Đang mượn' })
            .populate({
                path: 'libraryCard',
                populate: { path: 'accountId' }
            })
            .sort({ dateBorrow: 1 })
        const phieuDaTraSach = await BorrowBookTicket.find({ statusBorrowBook: ['Đã trả', 'Trễ hẹn'] })
            .populate({
                path: 'libraryCard',
                populate: { path: 'accountId' }
            })
            .sort({ dateBorrow: 1 })
        var data = []
        phieuDaTraSach.forEach(async element => {
            var chiTietMuon = await DetailBorrowBookTicket.find({ borrowBookTicketId: element._id })
            var total = chiTietMuon.length
            var count = 0
            chiTietMuon.forEach(e => {
                if (e.status == "Đã trả") {
                    count++
                }
            })
            var row = {
                borrowBookTicketId: element._id,
                readerName: element.libraryCard.accountId.displayName,
                dateBorrow: element.dateBorrow,
                statusBorrowBook: element.statusBorrowBook,
                numberOfBooksReturnedBack: count,
                numberOfBookBorrowed: total
            }
            data.push(row)
        })
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if(numClients == 0){
                    socket.join(roomName)
                }
            }
        
            socket.on('disconnect', () => {
                if(currentUser && currentUser.role.name == 'USER'){
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
            });
        });
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })
        res.render('staff/muonTraSach', {
            currentUser: currentUser,
            phieuDangXuLy: phieuDangXuLy,
            phieuTraSach: phieuTraSach,
            phieuDaTraSach: data,
            maxBorrowDates: maxBorrowDates.value
        });
        //res.json(data)
    }
    //cho mượn sách
    async lendBook(req, res) {
        try {
            var detailsBorrowBookTiket = await DetailBorrowBookTicket.find({ borrowBookTicketId: req.body.borrowBookTicketId })
            for (let i = 0; i < detailsBorrowBookTiket.length; i++) {
                var book = await Book.findById(detailsBorrowBookTiket[i].bookId)
                if (book.quantity == 0) {
                    const redirectUrl = urlHelper.getEncodedMessageUrl('/muonTraSach', {
                        type: 'error',
                        title: 'Thất bại',
                        text: 'Không đủ số lượng sách để mượn!'
                    })
                    return res.redirect(redirectUrl)
                }
                book.quantity = book.quantity - 1
                await book.save()
                detailsBorrowBookTiket[i].status = 'Đang mượn'
                await detailsBorrowBookTiket[i].save()
            }
            var borrowBookTicket = await BorrowBookTicket.findOneAndUpdate({ _id: req.body.borrowBookTicketId }, { statusBorrowBook: 'Đang mượn' })
            var libraryCard = await LibraryCard.findOne({_id : borrowBookTicket.libraryCard}).populate('accountId')

            var notify = new Notification({
                title : "Mượn sách",
                message : "Yêu cầu mượn sách đã được chấp nhận",
                receiver : libraryCard.accountId
            })
            await notify.save()

            var io = req.app.get('socketio')
            io.to(libraryCard.accountId.email).emit('show-notification-from-admin', 
                {
                    id : notify._id,
                    title : "Mượn sách",
                    message : "sách đã được châp nhận"
                })
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }
    //từ chối cho mượn sách
    async refuseToLendBook(req, res) {
        try {
            var borrowBookTicket = await BorrowBookTicket.findById(req.body.borrowBookTicketId)
            var libraryCard = await LibraryCard.findOne({_id : borrowBookTicket.libraryCard}).populate('accountId')
            var notify = new Notification({
                title : "Mượn sách",
                message : "Yêu cầu mượn sách của bạn bị từ chối",
                receiver : libraryCard.accountId
            })
            await notify.save()

            var io = req.app.get('socketio')
            io.to(libraryCard.accountId.email).emit('show-notification-from-admin', 
                {
                    id : notify._id,
                    title : "Mượn sách",
                    message : "Yêu cầu mượn sách của bạn bị từ chối"
                })
            await DetailBorrowBookTicket.deleteMany({ borrowBookTicketId: req.body.borrowBookTicketId })
            await BorrowBookTicket.deleteOne({ _id: req.body.borrowBookTicketId })
            res.redirect("back")
        } catch (error) {
            console.log(error)
        }
    }
    //trả sách
    async giveBookBack(req, res) {
        try {
            var now = new Date()
            var maxDaysToBorrow = await Regulation.findOne({name : "Số ngày mượn tối đa/1 lần mượn"})
            var sachtra = JSON.parse(req.body.sachtra)
            sachtra.forEach(e => {
                console.log('sach tra: '+ e.id + " " + e.tinhtrang)
            });
            var borrowTicketId = req.body.borrowTicketId
            sachtra.forEach(async (element) => {
                var detaiBorrow = await DetailBorrowBookTicket.findOneAndUpdate(
                    { bookId: element.id, borrowBookTicketId: borrowTicketId }, {
                    status: element.tinhtrang,
                    dateGiveBack: now
                })
                if(element.tinhtrang == 'Đã trả'){
                    var book = await Book.findById(element.id)
                    await Book.findOneAndUpdate({_id: element.id},{quantity: book.quantity+1 })
                }
            });
            setTimeout(async function(){
                var tienphat = parseInt(req.body.tienphat)
                if (tienphat > 0) {
                    var borrowBookTicket = await BorrowBookTicket.findById(borrowTicketId)
                    if (borrowBookTicket.fineTicket == null) {
                        var fineTicket = new FineTicket({
                            dateFine: now,
                            fine: tienphat
                        })
                        fineTicket = await fineTicket.save()
                    } else {
                        var fineTicket = await FineTicket.findOneAndUpdate({
                            _id: borrowBookTicket.fineTicket
                        }, {
                            dateFine: now,
                            fine: tienphat
                        })
                    }

                    await BorrowBookTicket.findOneAndUpdate({ _id: borrowTicketId }, { fineTicket: fineTicket._id })
                }
                var sosachtra = 0
                var sachmuon = await DetailBorrowBookTicket.find({ borrowBookTicketId: borrowTicketId })
                var isLate = false
                var borrowBookTicket = await BorrowBookTicket.findById(borrowTicketId)
                sachmuon.forEach(e => {
                    console.log(e.status)
                    if (e.status != "Đang mượn") {
                        sosachtra++
                    }
                    var dateGiveBack = new Date(e.dateGiveBack)
                    var deadline = new Date(borrowBookTicket.dateBorrow)
                    deadline.setDate(deadline.getDate() + maxDaysToBorrow.value)
                    if (dateGiveBack > deadline) {
                        isLate = true;
                    }
                })
                if (sosachtra == sachmuon.length) {
                    await BorrowBookTicket.findOneAndUpdate({ _id: borrowTicketId }, { statusBorrowBook: "Đã trả" })
                    if (isLate) {
                        await BorrowBookTicket.findOneAndUpdate({ _id: borrowTicketId }, { statusBorrowBook: "Trễ hẹn" })
                    }
                }
                console.log("sach tra : " + sosachtra)
                console.log("sach muon : " + sachmuon.length)
                res.json("Trả sách thành công")
            },100)
        } catch (error) {
            console.log(error)
        }
    }
    //cho muon offline
    async lendBookOffline(req, res){
        const currentUser = await req.user
        res.render('staff/muonSachOffline',{
            currentUser : currentUser
        })
    }
    //gui mail nhac nho tra sach
    async sendMailRemind(){
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })
        const borrowBookTichet = await BorrowBookTicket.find({statusBorrowBook : 'Đang mượn'})

        borrowBookTichet.forEach(async (e) => {
            var now = new Date()
            var hanTraSach = new Date(e.dateBorrow)
            hanTraSach.setDate(hanTraSach.getDate()+ maxBorrowDates.value)
            var nhacHanTraSach = new Date(e.dateBorrow)
            nhacHanTraSach.setDate(nhacHanTraSach.getDate()+ maxBorrowDates.value-1)
            console.log('bay gio: '+now)
            console.log('han tra sach: '+hanTraSach)
            const detailBorrowBook = await DetailBorrowBookTicket.find({ borrowBookTicketId: e._id, status : 'Đang mượn' }).populate('bookId')
            const libraryCard = await LibraryCard.findOne({ libraryCard: e.libraryCard })
            const reader = await Account.findById(libraryCard.accountId)
            console.log(reader)
            //gửi mail nhắc trả sách
            var danhSachSachMuon = ''
            detailBorrowBook.forEach(e => {
                danhSachSachMuon += ' <p style="font-size: 14px; line-height: 140%;">- ' + e.bookId.name + '</p> '
            });
            if(now > hanTraSach){
                const subject = 'Nhắc nhở độc giả trả sách trễ hạn'
                var amp = GetHeader()+` 
                <p style="font-size: 14px; line-height: 140%;">Xin ch&agrave;o,</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">C&aacute;c cuốn s&aacute;ch sau đ&atilde; trễ hạn trả :</p>
                `+danhSachSachMuon+`
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">Mong bạn sắp xếp thời gian đến trả s&aacute;ch đ&uacute;ng hạn.</p>
                <p style="font-size: 14px; line-height: 140%;">Lưu &yacute; : Việc trả s&aacute;ch trễ sẽ bị xử phạt theo nội qui của thư viện.</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>`+GetFooter()
                sendEmail(reader.email, subject, amp)
            }else if(now >= nhacHanTraSach && now <= hanTraSach){
                const subject = 'Nhắc nhở độc giả trả sách'
                var amp =GetHeader()+ `
                <p style="font-size: 14px; line-height: 140%;">Xin ch&agrave;o,</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">Thư viện nhắc nhở bạn về việc trả c&aacute;c cuốn s&aacute;ch sau v&agrave;o ng&agrave;y `+hanTraSach.toLocaleDateString('vi-VN')+` : </p>
                `+danhSachSachMuon+`
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">Mong bạn sắp xếp thời gian đến trả s&aacute;ch đ&uacute;ng hạn.</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>`+GetFooter()
                sendEmail(reader.email, subject, amp)
            }
        });
    }
}

module.exports = new MuonTraSachController;