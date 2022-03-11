const express = require('express');
const router = express.Router();
const quanLyTacGiaController = require('../../controllers/staff/quanLyTacGiaController')

router.get('/', quanLyTacGiaController.index)
router.post('/', quanLyTacGiaController.create)

module.exports = router;