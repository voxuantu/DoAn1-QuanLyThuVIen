class MuonTraSachController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        res.render('staff/muonTraSach',{
            currentUser: currentUser,
            cart: cart
        });
    }
}

module.exports = new MuonTraSachController;