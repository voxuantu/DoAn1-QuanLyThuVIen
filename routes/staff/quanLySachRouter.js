const express = require('express');
const quanLySachController = require('../../controllers/staff/quanLySachController');
const router = express.Router();
const multer = require('multer');
const multerSingle = multer();


router.get('/create', quanLySachController.renderCreatePage)
router.get('/:page', quanLySachController.index)
router.post('/create', multerSingle.single('anh'), quanLySachController.create)


module.exports = router;