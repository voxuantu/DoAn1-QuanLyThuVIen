const express = require('express');
const quanLyNhaXuatBanControler = require('../../controllers/staff/quanLyNhaXuatBanController')
const router = express.Router();

router.post('/create', quanLyNhaXuatBanControler.create)