const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();
const {checkAuthenticated} = require('../middleware/baseAuth')
const {checkPermissions} = require('../middleware/baseAuth')

router.post('/themSachVaoGio', checkAuthenticated, checkPermissions(['USER']), apiController.addBookToCart)
router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau',  apiController.DoiMatKhau)
router.post('/xoaSachKhoiGio', checkAuthenticated, checkPermissions(['USER']), apiController.deleteBookFromCart)
router.post('/kiemTraNguoiDung', apiController.kiemTraNguoiDung)

module.exports = router;