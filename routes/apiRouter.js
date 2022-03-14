const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post('/themSachVaoGio', apiController.addBookToCart)
router.post('/layMa', apiController.LayMa)
router.post('/doiMatKhau', apiController.DoiMatKhau)
module.exports = router;