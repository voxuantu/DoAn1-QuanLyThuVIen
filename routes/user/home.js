const express = require('express');
const indexController = require('../../controllers/user/indexController');
const router = express.Router();

router.get('/autocomplete', indexController.autocomplete)
router.get('/timKiem', indexController.search)
router.get('/:page', indexController.index)
router.get('/:category/:page', indexController.filter)
router.delete('/dangXuat', indexController.logout)

module.exports = router;