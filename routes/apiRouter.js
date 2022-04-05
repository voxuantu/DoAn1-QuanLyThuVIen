const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

const {checkAuthenticated} = require('../middleware/baseAuth')
const {checkPermissions} = require('../middleware/baseAuth')

router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau',  apiController.DoiMatKhau)

router.post('/kiemTraNguoiDung', apiController.kiemTraNguoiDung)
router.post('/layChiTietPhieuMuon', apiController.layChiTietPhieuMuon)
router.post('/giaHanSach', apiController.giaHanSash)
router.get('/laySach', apiController.getBooks)

module.exports = router;