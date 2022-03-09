const BookPublisher = require('../../models/bookPublisher')

class QuanLyNhaXuatBanControler{
    async create(req, res){
        try {
            const bookPublisher = new BookPublisher({
                name : req.body.categoryName
            })
            await bookPublisher.save()
            res.json('Them Thanh Cong')
        } catch (error) {
            res.json(error)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler