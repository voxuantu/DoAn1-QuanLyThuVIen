const express = require('express');
const loginController = require('../../controllers/user/loginController');
const router = express.Router();
const passport = require('passport')
const {checkNotAuthenticated} = require('../../middleware/baseAuth')


router.get('/',checkNotAuthenticated, loginController.index)
router.post('/',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/trangChu/1',
    failureRedirect: '/dangNhap',
    failureFlash: true
}))

module.exports = router;