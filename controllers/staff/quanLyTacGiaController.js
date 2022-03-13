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
    async edit(req, res){
        try {
            var idTacGia = req.body.idTacGia
            var tenTacGia = req.body.tenTacGia
            await Author.findOneAndUpdate({_id : idTacGia}, {name : tenTacGia})
            res.redirect('/quanLyTacGia')
        } catch (error) {
            res.json(error)
        }
    }
    async delete(req,res){
        try {
            var idTacGia = req.body.id
            await Author.deleteOne({_id : idTacGia})
            res('1')
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new QuanLyNhaXuatBanControler