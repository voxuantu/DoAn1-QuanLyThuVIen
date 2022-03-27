const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau', apiController.DoiMatKhau)
router.post('/kiemTraNguoiDung', apiController.kiemTraNguoiDung)
router.post('/layChiTietPhieuMuon', apiController.layChiTietPhieuMuon)

module.exports = router;