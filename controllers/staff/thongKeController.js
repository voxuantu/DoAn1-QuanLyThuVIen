class ThongKeController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        res.render('staff/thongKe',{
            currentUser: currentUser,
            cart: cart
        });
    }
}

module.exports = new ThongKeController;