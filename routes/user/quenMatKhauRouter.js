const express = require('express');
const quenMatKhauController = require('../../controllers/user/quenMatKhauController');
const router = express.Router();


router.get('/', quenMatKhauController.index)

module.exports = router;