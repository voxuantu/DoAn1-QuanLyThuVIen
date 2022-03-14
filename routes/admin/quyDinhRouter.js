const express = require('express');
const quyDinhController = require('../../controllers/admin/quyDinhController');
const router = express.Router();

router.get('/', quyDinhController.index)
//router.post('/', quyDinhController.create)
router.post('/thayDoiQuyDinh/:id', quyDinhController.update)

module.exports = router;