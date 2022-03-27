const express = require('express');
const muonTraSachController = require('../../controllers/staff/muonTraSachController');
const router = express.Router();

router.get('/', muonTraSachController.index)
router.post('/choMuon', muonTraSachController.lendBook)
router.delete('/choMuon', muonTraSachController.refuseToLendBook)

module.exports = router;