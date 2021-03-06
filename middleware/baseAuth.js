
async function checkAuthenticated(req,res,next){
    const currentUser = await req.user
    if(currentUser){
        return next()
    }
    res.redirect('/dangNhap')
}
const checkPermissions = permissions => {
  return async (req, res, next) => {
    const currentUser = await req.user
    if(permissions.includes(currentUser.role.name)){
        return next()
    }
    res.json('Ban khong co quyen')
  }
}
async function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
      res.redirect('/trangChu')
    }
    next()
}

module.exports ={
    checkAuthenticated,
    checkNotAuthenticated,
    checkPermissions
}