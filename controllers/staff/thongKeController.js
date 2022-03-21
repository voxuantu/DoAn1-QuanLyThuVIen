class ThongKeController {
    async index(req,res){
        const currentUser = await req.user
        res.render('staff/thongKe',{
            currentUser: currentUser
        });
    }
}

module.exports = new ThongKeController;