const BookPublisher = require('../../models/bookPublisher')

class QuanLyNhaXuatBanControler{
    async index(req, res){
        try{
            const bookPublishers = await BookPublisher.find({});
            const currentUser = await req.user
            res.render('staff/quanLyNhaXuatBan',{
                bookPublishers : bookPublishers,
                currentUser : currentUser
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
}

module.exports = new QuanLyNhaXuatBanControler