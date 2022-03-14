class GioiThieuController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        res.render('user/gioiThieu',{
            currentUser: currentUser,
            cart: cart
        });
    }
}

module.exports = new GioiThieuController;