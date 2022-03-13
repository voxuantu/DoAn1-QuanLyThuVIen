const express = require('express');
const gioSachController = require('../../controllers/user/gioSachController');
const router = express.Router();


router.get('/', gioSachController.index)

module.exports = router;