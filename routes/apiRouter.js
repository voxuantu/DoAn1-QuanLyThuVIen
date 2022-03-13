const express = require('express');
const apiController = require('../controllers/apiController');
const router = express.Router();

router.post('/themSachVaoGio', apiController.addBookToCart)

module.exports = router;