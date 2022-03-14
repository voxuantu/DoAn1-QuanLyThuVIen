const BookPublisher = require('../../models/bookPublisher')

class QuanLyNhaXuatBanControler{
    async index(req, res){
        try{
            var cart = req.session.cart
            const bookPublishers = await BookPublisher.find({});
            const currentUser = await req.user
            res.render('staff/quanLyNhaXuatBan',{
                bookPublishers : bookPublishers,
                currentUser : currentUser,
                cart: cart
            })
        } catch (err){
            res.json(error)
        }
    }
    async create(req, res){
        try {
            const bookPublisher = new BookPublisher({
                name : req.body.tenNhaXB
            })
            await bookPublisher.save()
            res.redirect('/quanLyNhaXuatBan')
        } catch (error) {
            res.json(error)
        }
    }
    async edit(req, res){
        try {
            var idNbx = req.body.idNbx
            var tenNbx = req.body.tenNbx
            await BookPublisher.findOneAndUpdate({_id : idNbx}, {name : tenNbx})
            res.redirect('/quanLyNhaXuatBan')
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req,res){
        try {
            var id = req.body.id
            await BookPublisher.deleteOne({_id : id})
            res('1')
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler