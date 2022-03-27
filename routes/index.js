//Route Admin
const quyDinhRouter = require('./admin/quyDinhRouter')
const quanLyNhanVienRouter = require('./admin/quanLyNhanVienRouter')

//Route Staff
const muonTraSachRouter = require('./staff/muonTraSachRouter')
const thongKeRouter = require('./staff/thongKeRouter')
const quanLySachRouter = require('./staff/quanLySachRouter');
const quanLyTheLoaiRouter = require('./staff/quanLyTheLoaiRouter');
const quanLyDocGiaRouter = require('./staff/quanLyDocGiaRouter')

//Route User
const indexRouter = require('./user/home')
const loginRouter = require('./user/login')
const gioiThieuRouter = require('./user/gioiThieuRouter')
const lienHeRouter = require('./user/lienHeRouter')
const quenMatKhauRouter = require('./user/quenMatKhauRouter')
const trangCaNhanRouter = require('./user/trangCaNhanRouter')
const quanLyNhaXuatBanRouter = require('./staff/quanLyNhaXuatBanRouter')
const quanLyTacGiaRouter = require('./staff/quanLyTacGiaRouter')
const chiTietSachRouter = require('./user/chiTietSachRouter')
const gioSachRouter = require('./user/gioSachRouter')

//AJAX API Controller
const apiRouter = require('./apiRouter')

//Authentication
const {checkAuthenticated} = require('../middleware/baseAuth')
const {checkPermissions} = require('../middleware/baseAuth')

function route (app) {
    app.use('/dangNhap', loginRouter)
    app.use('/quanLySach',checkAuthenticated, checkPermissions(['ADMIN', 'MOD1']), quanLySachRouter)
    app.use('/quanLyTheLoai', checkAuthenticated, checkPermissions(['ADMIN', 'MOD1']), quanLyTheLoaiRouter)
    app.use('/quanLyNhaXuatBan', checkAuthenticated, checkPermissions(['ADMIN', 'MOD1']), quanLyNhaXuatBanRouter)
    app.use('/quanLyTacGia', checkAuthenticated, checkPermissions(['ADMIN', 'MOD1']), quanLyTacGiaRouter)
    app.use('/muonTraSach', checkAuthenticated, checkPermissions(['ADMIN', 'MOD2']), muonTraSachRouter)
    app.use('/gioiThieu', gioiThieuRouter)
    app.use('/lienHe', lienHeRouter)
    app.use('/quenMatKhau', quenMatKhauRouter)
    app.use('/thongKe', checkAuthenticated, checkPermissions(['ADMIN', 'MOD1']), thongKeRouter)
    app.use('/trangCaNhan',checkAuthenticated ,trangCaNhanRouter)
    app.use('/chiTietSach', chiTietSachRouter)
    app.use('/gioSach',checkAuthenticated, gioSachRouter)
    app.use('/quyDinh',checkAuthenticated, checkPermissions(['ADMIN']), quyDinhRouter)

    app.use('/api', apiRouter)

    app.use('/quanLyDocGia',checkAuthenticated, checkPermissions(['ADMIN','MOD1']), quanLyDocGiaRouter)
    app.use('/quanLyNhanVien',checkAuthenticated, checkPermissions(['ADMIN']), quanLyNhanVienRouter)

    app.use('/trangChu', indexRouter)
    
}

module.exports = route