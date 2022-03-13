const express = require('express');
const quanLyTheLoaiController = require('../../controllers/staff/quanLyTheLoaiController');
const router = express.Router();

router.get('/', quanLyTheLoaiController.index)
router.post('/', quanLyTheLoaiController.create)
router.put('/', quanLyTheLoaiController.edit)
router.post('/delete', quanLyTheLoaiController.delete)

module.exports = router