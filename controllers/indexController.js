class IndexController {
    async index(req,res){
        const currentUser = req.user
        res.render('index',{currentUser: currentUser});
    }
    logout(req, res){
        req.logOut()
        res.redirect('/login')
    }
}

module.exports = new IndexController;