class StaffController {
    index(req,res){
        res.render('staff');
    }
}

module.exports = new StaffController;