class LienHeController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        res.render('user/lienHe',{
            currentUser: currentUser,
            cart: cart
        });
    }
}

module.exports = new LienHeController;