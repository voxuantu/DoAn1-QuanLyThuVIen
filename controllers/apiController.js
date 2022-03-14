const Token = require('../models/token');
const Account = require('../models/account');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcrypt')

class APIController {
    addBookToCart(req, res) {
        var isExist = false
        var cart = [];
        if (!req.session.cart) {
            cart.push(req.body.id)
            req.session.cart = cart
        } else {
            req.session.cart.forEach(itemCart => {
                if (itemCart == req.body.id) {
                    isExist = true
                }
                cart.push(itemCart)
            });
            if (isExist == false) {
                cart.push(req.body.id);
            }
            req.session.cart = cart
        }
        console.log(req.session.cart)
        console.log(req.session.cart.length)
        //res.redirect('back')
        if (isExist == true) {
            res.json({
                message: 'That bai',
                cartQuantity: req.session.cart.length
            })
        } else {
            res.json({
                message: 'Thanh cong',
                cartQuantity: req.session.cart.length
            })
        }
        //console.log(req)
    }
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
            const text = "Mã xác nhận của bạn là : " + token.token

            sendEmail(user.email, subject, text)
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
            if(token.token == code){
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
    //Xóa sách ra khỏi giỏ
    deleteBookFromCart(req,res){
        var cart = req.session.cart
        const index = cart.indexOf(req.body.id)
        if(index > -1){
            cart.splice(index,1)
            req.session.cart = cart
            req.session.isDeleted = true
            res.json('Thanh cong')
        }else{
            res.json('That bai')
        }
    }
}

module.exports = new APIController