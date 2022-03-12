const express = require('express');
const chiTietSachController = require('../../controllers/user/chiTietSachController');
const router = express.Router();


router.get('/:id', chiTietSachController.index)
//router.post('/:id', chiTietSachController.addBookToCard)

module.exports = router;