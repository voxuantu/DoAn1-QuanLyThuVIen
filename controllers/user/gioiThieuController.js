class GioiThieuController {
    async index(req,res){
        const currentUser = await req.user
        res.render('user/gioiThieu',{currentUser: currentUser});
    }
}

module.exports = new GioiThieuController;