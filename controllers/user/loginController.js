const Account = require('../../models/account')
const Role = require('../../models/role')

class LoginController {
    async index(req, res) {
        const account = new Account()
        const roles = await Role.find({})
        res.render('user/login', {
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
}

module.exports = new LoginController;