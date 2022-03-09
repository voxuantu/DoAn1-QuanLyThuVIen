const express = require('express');
const loginController = require('../../controllers/user/loginController');
const router = express.Router();
const passport = require('passport')
const {checkNotAuthenticated} = require('../../middleware/baseAuth')


router.get('/',checkNotAuthenticated, loginController.index)
router.post('/',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
// router.get('/register',checkNotAuthenticated, loginController.register)
// router.post('/register',checkNotAuthenticated, loginController.createAccount)

module.exports = router;