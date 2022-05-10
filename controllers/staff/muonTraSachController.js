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
            console.log('bay gio: '+now)
            console.log('han tra sach: '+hanTraSach)
            if(now >= hanTraSach){
                const detailBorrowBook = await DetailBorrowBookTicket.find({borrowBookTicketId: e._id}).populate('bookId')
                const libraryCard = await LibraryCard.findOne({libraryCard : e.libraryCard})
                const reader = await Account.findById(libraryCard.accountId)
                console.log(reader)
                //gửi mail nhắc trả sách
                var danhSachSachMuon = ''
                detailBorrowBook.forEach(e => {
                    danhSachSachMuon += ' <p style="font-size: 14px; line-height: 140%;">- '+e.bookId.name+'</p> '
                });
                const subject = 'Nhắc nhở độc giả trả sách'
                const amp = `
                <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                <head>
                <!--[if gte mso 9]>
                <xml>
                <o:OfficeDocumentSettings>
                    <o:AllowPNG/>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="x-apple-disable-message-reformatting">
                <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                <title></title>
                
                    <style type="text/css">
                    @media only screen and (min-width: 520px) {
                .u-row {
                    width: 500px !important;
                }
                .u-row .u-col {
                    vertical-align: top;
                }
                
                .u-row .u-col-100 {
                    width: 500px !important;
                }
                
                }
                
                @media (max-width: 520px) {
                .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                }
                .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .u-row {
                    width: calc(100% - 40px) !important;
                }
                .u-col {
                    width: 100% !important;
                }
                .u-col > div {
                    margin: 0 auto;
                }
                }
                body {
                margin: 0;
                padding: 0;
                }
                
                table,
                tr,
                td {
                vertical-align: top;
                border-collapse: collapse;
                }
                
                p {
                margin: 0;
                }
                
                .ie-container table,
                .mso-container table {
                table-layout: fixed;
                }
                
                * {
                line-height: inherit;
                }
                
                a[x-apple-data-detectors='true'] {
                color: inherit !important;
                text-decoration: none !important;
                }
                
                table, td { color: #000000; } a { color: #0000ee; text-decoration: underline; } </style>
                
                
                
                </head>
                
                <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #ffffff;color: #000000">
                <!--[if IE]><div class="ie-container"><![endif]-->
                <!--[if mso]><div class="mso-container"><![endif]-->
                <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #ffffff;width:100%" cellpadding="0" cellspacing="0">
                <tbody>
                <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #ffffff;"><![endif]-->
                    
                
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;background-color: transparent;">
                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
                    
                <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                <div style="width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                    <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
                    
                    <img align="center" border="0" src="https://res.cloudinary.com/cake-shop/image/upload/v1649908425/Logo2_wuuabp.png" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 200px;" width="200"/>
                    
                    </td>
                </tr>
                </table>
                
                    </td>
                    </tr>
                </tbody>
                </table>
                
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                    <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                <p style="font-size: 14px; line-height: 140%;">Xin ch&agrave;o,</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">Thư viện nhắc nhở bạn về việc trả c&aacute;c cuốn s&aacute;ch sau v&agrave;o ng&agrave;y `+hanTraSach.toLocaleDateString('vi-VN')+` : </p>
                `+danhSachSachMuon+`
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">Mong bạn sắp xếp thời gian đến trả s&aacute;ch đ&uacute;ng hạn.</p>
                <p style="font-size: 14px; line-height: 140%;">&nbsp;</p>
                <p style="font-size: 14px; line-height: 140%;">Th&acirc;n mến,</p>
                <p style="font-size: 14px; line-height: 140%;">River Library</p>
                </div>
                
                    </td>
                    </tr>
                </tbody>
                </table>
                
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                    <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                    <tr style="vertical-align: top">
                        <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                        <span>&#160;</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                
                    </td>
                    </tr>
                </tbody>
                </table>
                
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                    <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                <div style="line-height: 140%; text-align: left; word-wrap: break-word;">
                    <p style="font-size: 14px; line-height: 140%; text-align: center;">Mọi thắc mắc c&oacute; thể li&ecirc;n hệ với ch&uacute;ng t&ocirc;i qua : </p>
                </div>
                
                    </td>
                    </tr>
                </tbody>
                </table>
                
                <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                    <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
                        
                <div align="center">
                <div style="display: table; max-width:147px;">
                <!--[if (mso)|(IE)]><table width="147" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:147px;"><tr><![endif]-->
                
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                    <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://facebook.com/" title="Facebook" target="_blank">
                        <img src="https://res.cloudinary.com/cake-shop/image/upload/v1649908425/facebook_uuzryk.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                    </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                    <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://twitter.com/" title="Twitter" target="_blank">
                        <img src="https://res.cloudinary.com/cake-shop/image/upload/v1649908426/twitter_yy29da.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                    </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 5px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 5px">
                    <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://messenger.com/" title="Messenger" target="_blank">
                        <img src="https://res.cloudinary.com/cake-shop/image/upload/v1649908425/messenger_b44lcd.png" alt="Messenger" title="Messenger" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                    </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                    <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                        <a href="https://email.com/" title="Email" target="_blank">
                        <img src="https://res.cloudinary.com/cake-shop/image/upload/v1649908426/gmail_beanaw.png" alt="Email" title="Email" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                        </a>
                    </td></tr>
                    </tbody></table>
                    <!--[if (mso)|(IE)]></td><![endif]-->
                    
                    
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
                </div>
                
                    </td>
                    </tr>
                </tbody>
                </table>
                
                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div>
                </div>
                <!--[if (mso)|(IE)]></td><![endif]-->
                    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                </div>
                </div>
                
                
                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
                </tbody>
                </table>
                <!--[if mso]></div><![endif]-->
                <!--[if IE]></div><![endif]-->
                </body>
                
                </html>
                `
                sendEmail(reader.email, subject, amp)
            }
        });
    }
}

module.exports = new MuonTraSachController;