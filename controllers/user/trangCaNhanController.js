const { bufferUpload } = require('../../utils/uploadImage')
const Account = require('../../models/account')
const BorrowBookTicket = require('../../models/borrowBookTicket')
const Regulation = require('../../models/regulation')
const LibraryCard = require('../../models/libraryCard')
const Comment = require("../../models/comment")
const urlHelper = require("../../utils/url")
const DetailBorrowBookTicket = require("../../models/detailBorrowBookTicket")
const Book = require("../../models/book")


class TrangCaNhanController {
    async index(req, res) {
        const currentUser = await req.user
        if (currentUser.role.name == 'USER') {
            const libraryCard = await LibraryCard.findOne({ accountId: currentUser._id })
            var cart = req.session.cart
            const borrowBookCard = await BorrowBookTicket.aggregate().match({ libraryCard: libraryCard._id }).lookup({
                from: 'detailborrowbooks',
                localField: '_id',
                foreignField: 'borrowBookTicketId',
                as: 'bookBorrowed'
            })
            const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })

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

            res.render('user/trangCaNhan', {
                currentUser: currentUser,
                cart: cart,
                borrowBookCard: borrowBookCard,
                maxBorrowDates: maxBorrowDates.value
            });
        } else {
            res.render('staff/trangCaNhanStaff', {
                currentUser: currentUser
            })
        }
    }
    //update user
    async update(req, res) {
        //res.send('test edit user')
        let user
        try {
            user = await Account.findById(req.params.id)
            if (req.file != null) {
                const { buffer } = req.file;
                const { secure_url } = await bufferUpload(buffer);
                user.img = secure_url
            }
            user.displayName = req.body.displayName,
                user.address = req.body.address,
                user.email = req.body.email,
                user.phone = req.body.phone,
                user.birth = new Date(req.body.birth)

            await user.save()
            res.redirect('/trangCaNhan')
        } catch (error) {
            console.log(error)
            res.send("Something went wrong please try again later..");
        }
    }
    //Bình luận sách
    async commentBook(req, res) {
        try {
            const currentUser = await req.user
            var comment = new Comment({
                content: req.body.content,
                starRating: req.body.starRating,
                dateComment: new Date(),
                bookId: req.body.bookId,
                reader: currentUser.id
            })
            await comment.save()
            await DetailBorrowBookTicket.findOneAndUpdate({ _id: req.body.detailBorrowBookId }, { isComment: true })
            const comments = await Comment.find({ bookId: req.body.bookId })
            var starRating = 0
            comments.forEach(e => {
                starRating += e.starRating
            });
            starRating /= comments.length;
            await Book.findOneAndUpdate({ _id: req.body.bookId }, { starRating: starRating })
            const redirectUrl = urlHelper.getEncodedMessageUrl('/chiTietSach/' + req.body.bookId, {
                type: 'success',
                title: 'Thành công',
                text: 'Bình luận sách thành công!'
            })
            res.redirect(redirectUrl)
        } catch (error) {
            console.log(error)
        }
    }
    // Thanh toán online
    vnpayOnline(req, res, next) {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        var tmnCode = process.env.vnp_TmnCode
        var secretKey = process.env.vnp_HashSecre
        var vnpUrl = process.env.vnp_Url
        var returnUrl = process.env.vnp_ReturnUrl

        var dateFormat = require("dateformat");
        var date = new Date();

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        var amount = req.body.amount;
        var bankCode = req.body.bankCode;

        var orderInfo = req.body.orderDescription;
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl)
    }
    async vnpayReturn(req, res) {
        var vnp_Params = req.query;

        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = process.env.vnp_TmnCode
        var secretKey = process.env.vnp_HashSecre

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        const currentUser = await req.user
        const libraryCard = await LibraryCard.findOne({ accountId: currentUser._id })
        var cart = req.session.cart
        const borrowBookCard = await BorrowBookTicket.aggregate().match({ libraryCard: libraryCard._id }).lookup({
            from: 'detailborrowbooks',
            localField: '_id',
            foreignField: 'borrowBookTicketId',
            as: 'bookBorrowed'
        })
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            var hanSuDungThe = await Regulation.findOne({ name: "Hạn sử dụng thẻ thư viện ( ngày )" })
            var date = new Date(libraryCard.createdDate)
            date.setDate(date.getDate() + hanSuDungThe.value)
            libraryCard.createdDate = date
            await libraryCard.save()
            res.render('user/success', {
                code: vnp_Params['vnp_ResponseCode'],
                currentUser: currentUser,
                cart: cart,
                borrowBookCard: borrowBookCard,
                maxBorrowDates: maxBorrowDates.value
            })
        } else {
            res.render('user/success', {
                code: '97',
                currentUser: currentUser,
                cart: cart,
                borrowBookCard: borrowBookCard,
                maxBorrowDates: maxBorrowDates.value
            })
        }
    }
    // hiển thị form thanh toán
    async loadFormThanhToan(req, res) {
        const currentUser = await req.user
        const libraryCard = await LibraryCard.findOne({ accountId: currentUser._id })
        var cart = req.session.cart
        const borrowBookCard = await BorrowBookTicket.aggregate().match({ libraryCard: libraryCard._id }).lookup({
            from: 'detailborrowbooks',
            localField: '_id',
            foreignField: 'borrowBookTicketId',
            as: 'bookBorrowed'
        })
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })
        res.render('user/formThanhToan', {
            currentUser: currentUser,
            cart: cart,
            borrowBookCard: borrowBookCard,
            maxBorrowDates: maxBorrowDates.value
        })
    }
    async success(req, res) {
        const currentUser = await req.user
        const libraryCard = await LibraryCard.findOne({ accountId: currentUser._id })
        var cart = req.session.cart
        const borrowBookCard = await BorrowBookTicket.aggregate().match({ libraryCard: libraryCard._id }).lookup({
            from: 'detailborrowbooks',
            localField: '_id',
            foreignField: 'borrowBookTicketId',
            as: 'bookBorrowed'
        })
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })
        res.render('user/success', {
            code: '00',
            currentUser: currentUser,
            cart: cart,
            borrowBookCard: borrowBookCard,
            maxBorrowDates: maxBorrowDates.value
        })
    }
    momo(req1, res) {
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        var partnerCode = process.env.partnerCode
        var accessKey = process.env.accessKey
        var secretkey = process.env.secretkey
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = "Gia hạn thẻ thư viện với MoMo";
        var redirectUrl = process.env.redirectUrl
        var ipnUrl = process.env.ipnUrl
        var amount = "50000";
        var requestType = "captureWallet"
        var extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        //Send the request and get the response
        const req = https.request(options, function (response) {
            console.log(`Status: ${response.statusCode}`);
            console.log(`Headers: ${JSON.stringify(response.headers)}`);
            response.setEncoding('utf8');
            response.on('data', (body) => {
                console.log('Body: ');
                console.log(body);
                console.log('payUrl: ');
                console.log(JSON.parse(body).payUrl);
                res.redirect(JSON.parse(body).payUrl)
            });
            response.on('end', () => {
                console.log('No more data in response.');
            });
        })
        req.on('error', (e) => {
            console.log(`problem with request: ${e.message}`);
        });

        //write data to request body
        console.log("Sending....")
        req.write(requestBody);
        req.end();
    }
    async momoReturn(req, res) {
        const currentUser = await req.user
        const libraryCard = await LibraryCard.findOne({ accountId: currentUser._id })
        var cart = req.session.cart
        const borrowBookCard = await BorrowBookTicket.aggregate().match({ libraryCard: libraryCard._id }).lookup({
            from: 'detailborrowbooks',
            localField: '_id',
            foreignField: 'borrowBookTicketId',
            as: 'bookBorrowed'
        })
        const maxBorrowDates = await Regulation.findOne({ name: 'Số ngày mượn tối đa/1 lần mượn' })

        var hanSuDungThe = await Regulation.findOne({ name: "Hạn sử dụng thẻ thư viện ( ngày )" })
        var date = new Date(libraryCard.createdDate)
        date.setDate(date.getDate() + hanSuDungThe.value)
        libraryCard.createdDate = date
        await libraryCard.save()
        res.render('user/success', {
            code: '00',
            currentUser: currentUser,
            cart: cart,
            borrowBookCard: borrowBookCard,
            maxBorrowDates: maxBorrowDates.value
        })
    }

}
function momoCreatePayment() {


}

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = new TrangCaNhanController;
