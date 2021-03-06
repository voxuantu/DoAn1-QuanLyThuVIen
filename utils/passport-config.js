const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Account = require('../models/account')

function initialize(passport){
    const authenticateUser = async function(username, password, done){
        let user = await getUserByUsername(username)
        if(user == null){
            return done(null, false, {message: 'Không người dùng nào có tài khoản đó'})
        }

        try {
            if( await bcrypt.compare(password, user.password) && user.isBlock == false){
                
                return done(null,user)
            }else if(user.isBlock == true){
                return done(null, false, {message: 'Tài khoản này hiện đang bị khóa'})
            }else{
                return done(null, false, {message: 'Mật khẩu không chính xác'})
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'username'},authenticateUser))
    passport.serializeUser((user,done) => done(null, user.id))
    passport.deserializeUser((id,done) => { return done(null, getUserById(id))})
}

async function getUserByUsername(username){
    try {
        const acc = await Account.findOne({username : username}).populate('role').exec()
        return acc
    } catch (error) {
        console.log("get user by username error")
    }
}

async function getUserById(id){
    try {
        const acc = await Account.findById(id).populate('role').exec()
        return acc
    } catch (error) {
        console.log("get user by id error")
    }
}

module.exports = initialize