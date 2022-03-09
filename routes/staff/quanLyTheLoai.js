const express = require('express');
const quanLyTheLoaiController = require('../../controllers/staff/quanLyTheLoaiController');
const router = express.Router();

router.get('/', quanLyTheLoaiController.index)
router.post('/create', quanLyTheLoaiController.create)

module.exports = router