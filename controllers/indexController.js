class IndexController {
    index(req,res){
        res.render('index');
    }
}

module.exports = new IndexController;