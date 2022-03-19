const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();
const {checkAuthenticated} = require('../middleware/baseAuth')


router.post('/themSachVaoGio', apiController.addBookToCart)
router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau', apiController.DoiMatKhau)
router.post('/xoaSachKhoiGio', apiController.deleteBookFromCart)
router.post('/xoaHetSachKhoiGio', apiController.deleteAllBookFromCart)


router.post('/themSachVaoGio', checkAuthenticated, apiController.addBookToCart)
router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau',  apiController.DoiMatKhau)
router.post('/xoaSachKhoiGio', checkAuthenticated, apiController.deleteBookFromCart)
router.post('/kiemTraNguoiDung', apiController.kiemTraNguoiDung)

module.exports = router;