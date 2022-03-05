const express = require('express');
const staffController = require('../controllers/staffController');
const router = express.Router();


router.get('/', staffController.index)

module.exports = router;