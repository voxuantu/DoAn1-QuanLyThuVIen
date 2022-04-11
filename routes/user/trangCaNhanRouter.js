const express = require('express');
const trangCaNhanController = require('../../controllers/user/trangCaNhanController');
const router = express.Router();
const multer = require("multer");
const multerSingle = multer();


router.get('/', trangCaNhanController.index)
router.put('/:id',multerSingle.single("img"),trangCaNhanController.update)
router.post('/binhLuanSach', trangCaNhanController.commentBook)

module.exports = router;