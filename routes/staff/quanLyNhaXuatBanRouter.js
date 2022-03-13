const express = require('express');
const quanLyNhaXuatBanController = require('../../controllers/staff/quanLyNhaXuatBanController');
const router = express.Router();

router.get('/', quanLyNhaXuatBanController.index)
router.post('/', quanLyNhaXuatBanController.create)
router.put('/', quanLyNhaXuatBanController.edit)
router.post('/delete', quanLyNhaXuatBanController.delete)
module.exports = router;
