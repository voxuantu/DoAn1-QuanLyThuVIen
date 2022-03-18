const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post('/themSachVaoGio', apiController.addBookToCart)
router.post('/xoaSachKhoiGio', apiController.deleteBookFromCart)
router.post('/xoaHetSachKhoiGio', apiController.deleteAllBookFromCart)

module.exports = router;