class IndexController {
    async index(req,res){
        const currentUser = await req.user
        res.render('index',{currentUser: currentUser});
    }
    logout(req, res){
        req.logOut()
        res.redirect('/dangNhap')
    }
}

module.exports = new IndexController;