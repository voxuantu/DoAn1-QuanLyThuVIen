const express = require('express');
const indexController = require('../../controllers/user/indexController');
const router = express.Router();

router.get('/autocomplete', indexController.autocomplete)
router.get('/timKiem', indexController.search)
router.get('/:category', indexController.filter)
router.delete('/dangXuat', indexController.logout)
router.get('/', indexController.index)

module.exports = router;