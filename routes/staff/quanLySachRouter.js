const express = require('express');
const quanLySachController = require('../../controllers/staff/quanLySachController');
const router = express.Router();
const multer = require('multer');
const multerSingle = multer();

//multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
var upload = multer({ storage: storage });

router.get('/create', quanLySachController.renderCreatePage)
router.get('/timKiem', quanLySachController.search)
router.get('/edit/:id', quanLySachController.renderEditPage)
router.get('/', quanLySachController.index)
router.post('/create', multerSingle.single('anh'), quanLySachController.create)
router.post('/edit/:id',multerSingle.single('anh'), quanLySachController.edit)
router.post('/delete', quanLySachController.delete)
router.post('/excelUpload',upload.single('excel'), quanLySachController.readFileExcel)
router.post('/downExcel', quanLySachController.downloadFielExcel)

module.exports = router;