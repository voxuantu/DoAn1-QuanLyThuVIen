const Account = require('../models/account')
const Role = require('../models/role')
const jwt = require('jsonwebtoken')

class LoginController {
    async index(req, res) {
        const account = new Account()
        const roles = await Role.find({})
        res.render('login', {
            roles: roles,
            account: account
        });
    };
    async login(req, res) {

        try {
            const acc = await Account.find({
                username : req.body.username,
                password : req.body.password
            }).populate('role');
            if (acc) {
                var token = jwt.sign({ _id : acc[0]._id}, process.env.SECRET)
                
                
            } else {
                res.redirect("/login")
            }
        } catch (err) {
            res.json(err)
        }
    }
}

module.exports = new LoginController;