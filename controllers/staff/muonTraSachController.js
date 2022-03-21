class MuonTraSachController {
    async index(req,res){
        const currentUser = await req.user
        res.render('staff/muonTraSach',{
            currentUser: currentUser
        });
    }
}

module.exports = new MuonTraSachController;