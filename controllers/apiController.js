class APIController {
    //Thêm sách vào giỏ
    addBookToCart(req,res){
        var isExist = false
        var cart = []; 
        if(!req.session.cart){
            cart.push(req.body.id)
            req.session.cart = cart
        }else{
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
        }
        console.log(req.session.cart)
        console.log(req.session.cart.length)
        //res.redirect('back')
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
        //console.log(req)
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