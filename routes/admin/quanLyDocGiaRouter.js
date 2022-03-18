const express = require('express');
const quanLyDocGiaController = require('../../controllers/admin/quanLyDocGiaController');
const router = express.Router();

router.get('/themDocGia', quanLyDocGiaController.loadCreate)
router.get('/:page', quanLyDocGiaController.index)
router.post('/themDocGia', quanLyDocGiaController.create)

module.exports = router;