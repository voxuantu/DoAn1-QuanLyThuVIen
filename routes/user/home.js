const express = require('express');
const indexController = require('../../controllers/user/indexController');
const router = express.Router();


router.get('/', indexController.index)
router.delete('/logout', indexController.logout)

module.exports = router;