class StaffController {
    async index(req,res){
        const currentUser = await req.user
        res.render('staff',{name: currentUser.displayName});
    }
}

module.exports = new StaffController;