const express = require('express');
const quanLySachController = require('../../controllers/staff/quanLySachController');
const router = express.Router();
const multer = require('multer');
const multerSingle = multer();


router.get('/create', quanLySachController.renderCreatePage)
router.get('/timKiem', quanLySachController.search)
router.get('/edit/:id', quanLySachController.renderEditPage)
router.get('/:page', quanLySachController.index)
router.post('/create', multerSingle.single('anh'), quanLySachController.create)
router.post('/edit/:id',multerSingle.single('anh'), quanLySachController.edit)
router.post('/delete', quanLySachController.delete)


module.exports = router;