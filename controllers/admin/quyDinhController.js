const Regulation = require('../../models/regulation')

class QuyDinhController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        const regulations = await Regulation.find({})
        var suaThanhCong = req.session.suaThanhCong
        req.session.suaThanhCong = false
        res.render('admin/quyDinh',{
            currentUser: currentUser,
            cart: cart,
            regulations: regulations,
            suaThanhCong: suaThanhCong
        });
    }
    async create(req,res){
        try {
            const regulation = new Regulation({
                name: req.body.name,
                value: req.body.value
            })
            await regulation.save()
            res.redirect('/quyDinh')
        } catch (error) {
            console.log(error)
        }
    }

    async update(req,res){
        let regulation
        try {
            regulation =await Regulation.findById(req.params.id)
            regulation.value = req.body.value
            await regulation.save()
            req.session.suaThanhCong = true
            res.redirect('/quyDinh')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new QuyDinhController;