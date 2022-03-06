
async function checkAuthenticated(req,res,next){
    const currentUser = await req.user
    if(currentUser){
        return next()
    }
    res.redirect('/login')
}
async function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/')
    }
    next()
  }

module.exports ={
    checkAuthenticated,
    checkNotAuthenticated
}