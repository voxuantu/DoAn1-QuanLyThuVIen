const express = require('express');
const quanLyDocGiaController = require('../../controllers/staff/quanLyDocGiaController');
const router = express.Router();

router.get('/themDocGia', quanLyDocGiaController.loadCreate)
router.get('/', quanLyDocGiaController.index)
router.get('/taiKhoanBiChan', quanLyDocGiaController.loadBlockReader)
router.post('/themDocGia', quanLyDocGiaController.create)
router.post('/chanDocGia', quanLyDocGiaController.block)
router.post('/boChanDocGia', quanLyDocGiaController.unBlock)
router.post('/giaHanTheThuVien', quanLyDocGiaController.giaHanThe)

module.exports = router;