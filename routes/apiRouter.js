const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

const {checkAuthenticated} = require('../middleware/baseAuth')
const {checkPermissions} = require('../middleware/baseAuth')

router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau',  apiController.DoiMatKhau)

router.post('/kiemTraNguoiDung', apiController.kiemTraNguoiDung)
router.post('/layChiTietPhieuMuon', apiController.layChiTietPhieuMuon)
router.post('/layChiTietPhieuTra', apiController.layChiTietPhieuTra)
router.post('/giaHanSach', apiController.giaHanSash)
router.get('/laySach', apiController.getBooks)
router.get('/laySoLuotMuonSach', apiController.getNumberOfBorrowBooks)
router.get('/laySoTienPhat', apiController.getFine)
router.get('/layTop10SachMuonNhieuTrongTuan', apiController.getTop10OfBorrowedBook)
router.get('/layBinhLuan', apiController.getComments)
router.get('/layThongBaoThuThu', apiController.loadNotificationForLibrarian)
router.get('/layThongBaoDocGia', apiController.loadNotificationForReader)
router.post('/checkThongBao', apiController.checkNotification)
router.post('/getABook', apiController.getABook)
router.post('/bookLoanConfirmation', apiController.bookLoanConfirmation)
router.post('/getQRcode', apiController.getQRcode)
router.post('/saveQRcode', apiController.createImageQRcode)
router.post('/deleteQRcode', apiController.deleteImageQRcode)
router.get('/laySachHuHongHoacMat', apiController.getLostBook)
module.exports = router;