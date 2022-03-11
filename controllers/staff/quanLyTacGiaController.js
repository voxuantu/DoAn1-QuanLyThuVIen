const Author = require('../../models/author')

class QuanLyNhaXuatBanControler{
    async index(req, res){
        try{
            const authors = await Author.find({});
            const currentUser = await req.user
            res.render('staff/quanLyTacGia',{
                authors : authors,
                currentUser : currentUser
            })
        } catch (err){
            res.json(error)
        }
    }
    async create(req, res){
        try {
            const author = new Author({
                name : req.body.tentacgia
            })
            await author.save()
            res.redirect('/quanLyTacGia')
        } catch (error) {
            res.json(error)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler