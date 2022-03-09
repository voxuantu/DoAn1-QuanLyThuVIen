const express = require('express');
const gioiThieuController = require('../../controllers/user/gioiThieuController');
const router = express.Router();


router.get('/', gioiThieuController.index)

module.exports = router;