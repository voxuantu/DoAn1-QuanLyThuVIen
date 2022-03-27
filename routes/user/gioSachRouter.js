const express = require('express');
const gioSachController = require('../../controllers/user/gioSachController');
const router = express.Router();


router.get('/', gioSachController.index)
router.post('/themSachVaoGio', gioSachController.addBookToCart)
router.post('/xoaSachKhoiGio', gioSachController.deleteBookFromCart)
router.post('/xoaHetSachKhoiGio', gioSachController.deleteAllBookFromCart)
router.post('/muonSach', gioSachController.borrowBook)

module.exports = router;