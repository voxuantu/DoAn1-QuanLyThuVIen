const Regulation = require('../models/regulation')

class APIController {
    //Thêm sách vào giỏ
    async addBookToCart(req,res){
        let MaxBookBorrow
        try {
            MaxBookBorrow = await Regulation.findOne({name: 'Số sách mươn tối đa/1 lần mượn'})
        } catch (error) {
            console.log(error)
        }
        var isExist = false
        var isMaxBook = false
        var cart = []; 
        if(!req.session.cart){
            cart.push(req.body.id)
            req.session.cart = cart
        }else{
            if(req.session.cart.length < MaxBookBorrow.value){
                req.session.cart.forEach(itemCart => {
                    if(itemCart == req.body.id){
                        isExist = true
                    }
                    cart.push(itemCart)
                });
                if(isExist == false){
                    cart.push(req.body.id);
                }
                req.session.cart = cart
            }else{
                isMaxBook = true
            }
            
        }
        console.log(req.session.cart)
        console.log(req.session.cart.length)
        console.log(MaxBookBorrow.value)
        //res.redirect('back')
        if(!isMaxBook){
            if(isExist == true){
                res.json({
                    message: 'That bai',
                    cartQuantity: req.session.cart.length
                })
            }else{
                res.json({
                    message: 'Thanh cong',
                    cartQuantity: req.session.cart.length
                }) 
            }
        }else{
            res.json({
                message: 'Gio da day',
                cartQuantity: req.session.cart.length
            })
        }
        //console.log(req)
    }

    //Xóa 1 sách ra khỏi giỏ
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

    //Xóa hết sách ra khỏi giỏ
    deleteAllBookFromCart(req,res){
        var cart = []
        req.session.cart = cart
        req.session.isDeleted = true
        res.redirect('/gioSach')
    }
}

module.exports = new APIController