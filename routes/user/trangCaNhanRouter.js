const express = require('express');
const trangCaNhanController = require('../../controllers/user/trangCaNhanController');
const router = express.Router();
const multer = require("multer");
const multerSingle = multer();


router.get('/', trangCaNhanController.index)
router.put('/:id',multerSingle.single("img"),trangCaNhanController.update)
router.post('/binhLuanSach', trangCaNhanController.commentBook)
router.post('/taoHoaDonGiaHan', trangCaNhanController.vnpayOnline)
router.get('/taoHoaDonGiaHan', trangCaNhanController.loadFormThanhToan)
router.get('/vnpay_return', trangCaNhanController.vnpayReturn)
router.get('/success', trangCaNhanController.vnpayReturn)

module.exports = router;