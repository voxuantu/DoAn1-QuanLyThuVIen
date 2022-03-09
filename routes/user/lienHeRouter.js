const express = require('express');
const lienHeController = require('../../controllers/user/lienHeController');
const router = express.Router();


router.get('/', lienHeController.index)

module.exports = router;