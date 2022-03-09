class LienHeController {
    async index(req,res){
        const currentUser = await req.user
        res.render('user/lienHe',{currentUser: currentUser});
    }
}

module.exports = new LienHeController;