const express = require('express');
const quanLyDocGiaController = require('../../controllers/staff/quanLyDocGiaController');
const router = express.Router();
const multer = require('multer');
const multerSingle = multer();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
  
var upload = multer({ storage: storage });

router.get('/themDocGia', quanLyDocGiaController.loadCreate)
router.get('/', quanLyDocGiaController.index)
router.get('/taiKhoanBiChan', quanLyDocGiaController.loadBlockReader)
router.post('/themDocGia', quanLyDocGiaController.create)
router.post('/chanDocGia', quanLyDocGiaController.block)
router.post('/boChanDocGia', quanLyDocGiaController.unBlock)
router.post('/giaHanTheThuVien', quanLyDocGiaController.giaHanThe)
router.post('/themDocGiaBangExcel',upload.single('excel'), quanLyDocGiaController.importReaderFromExcel)
router.post('/downExcel', quanLyDocGiaController.downloadFielExcel)

module.exports = router;