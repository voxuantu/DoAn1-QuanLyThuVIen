const express = require('express');
const thongKeController = require('../../controllers/staff/thongKeController');
const router = express.Router();

router.get('/', thongKeController.index)

module.exports = router;