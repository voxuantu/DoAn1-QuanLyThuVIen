const express = require('express');
const muonTraSachController = require('../../controllers/staff/muonTraSachController');
const router = express.Router();

router.get('/', muonTraSachController.index)

module.exports = router;