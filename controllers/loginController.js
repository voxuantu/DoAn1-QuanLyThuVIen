const Account = require('../models/account')
const Role = require('../models/role')
const bcrypt = require('bcrypt')

class LoginController {
    async index(req, res) {
        const account = new Account()
        const roles = await Role.find({})
        res.render('login', {
            roles: roles,
            account: account
        });
    };

    //load trang register
    async register(req, res){
        try {
            const roles = await Role.find({})
            res.render('register',{roles : roles})
        } catch (error) {
            console.error(error)
        }
    }

    async createAccount(req, res){
        try {
            const hashPassword = await bcrypt.hash(req.body.password, 10)
            const account = new Account({
                username: req.body.username,
                password: hashPassword,
                displayName: req.body.displayName,
                address: req.body.address,
                phone: req.body.phone,
                birth: new Date(req.body.birth),
                email: req.body.email,
                role: req.body.role
            })
            const newAccount = await account.save()
            res.redirect('/login')
        } catch (error) {
            res.redirect('/login/register')
            console.log(error)
        }
    }
}

module.exports = new LoginController;