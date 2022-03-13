const BookPublisher = require('../../models/bookPublisher')

class QuanLyNhaXuatBanControler{

    async index(req, res){
        try{
            var cart = req.session.cart
            const bookPublishers = await BookPublisher.find({});
            const currentUser = await req.user

            const them = req.session.themThanhCong
            const sua = req.session.suaThanhCong
            const xoa = req.session.xoaThanhCong

            req.session.themThanhCong = false
            req.session.suaThanhCong = false
            req.session.xoaThanhCong = false

            res.render('staff/quanLyNhaXuatBan',{
                bookPublishers : bookPublishers,
                currentUser : currentUser,
                cart : cart,
                themThanhCong : them,
                suaThanhCong : sua,
                xoaThanhCong : xoa
            })
            
        } catch (err){
            res.json(err)
        }
    }
    async create(req, res){
        try {
            const bookPublisher = new BookPublisher({
                name : req.body.tenNhaXB
            })
            await bookPublisher.save()
            req.session.themThanhCong = true
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
            req.session.suaThanhCong = true
            res.redirect('/quanLyNhaXuatBan')
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req,res){
        try {
            var id = req.body.id
            await BookPublisher.deleteOne({_id : id})
            req.session.xoaThanhCong = true
            res('1')
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler