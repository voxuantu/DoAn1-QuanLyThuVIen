const express = require('express');
const quanLyNhanVienController = require('../../controllers/admin/quanLyNhanVienController');
const router = express.Router();

router.get('/themNhanVien', quanLyNhanVienController.loadCreate)
router.get('/', quanLyNhanVienController.index)
router.post('/themNhanVien', quanLyNhanVienController.create)

module.exports = router;