
//Route Staff
const muonTraSachRouter = require('./staff/muonTraSachRouter')
const thongKeRouter = require('./staff/thongKeRouter')
const quanLySachRouter = require('./staff/quanLySachRouter');
const quanLyTheLoaiRouter = require('./staff/quanLyTheLoaiRouter');

//Route User
const indexRouter = require('./user/home')
const loginRouter = require('./user/login')
const gioiThieuRouter = require('./user/gioiThieuRouter')
const lienHeRouter = require('./user/lienHeRouter')
const quenMatKhauRouter = require('./user/quenMatKhauRouter')
const trangCaNhanRouter = require('./user/trangCaNhanRouter')
const quanLyNhaXuatBanRouter = require('./staff/quanLyNhaXuatBanRouter')
const quanLyTacGiaRouter = require('./staff/quanLyTacGiaRouter')

const {checkAuthenticated} = require('../middleware/baseAuth')
const {checkPermissions} = require('../middleware/baseAuth');

function route (app) {
    app.use('/login', loginRouter)
    app.use('/quanLySach',checkAuthenticated, checkPermissions(['ADMIN']), quanLySachRouter)
    app.use('/quanLyTheLoai', checkAuthenticated, checkPermissions(['ADMIN']), quanLyTheLoaiRouter)
    app.use('/quanLyNhaXuatBan', checkAuthenticated, checkPermissions(['ADMIN']), quanLyNhaXuatBanRouter)
    app.use('/quanLyTacGia', checkAuthenticated, checkPermissions(['ADMIN']), quanLyTacGiaRouter)
    app.use('/muonTraSach', muonTraSachRouter)
    app.use('/gioiThieu', gioiThieuRouter)
    app.use('/lienHe', lienHeRouter)
    app.use('/quenMatKhau', quenMatKhauRouter)
    app.use('/thongKe', thongKeRouter)
    app.use('/trangCaNhan',trangCaNhanRouter)
    app.use('/', indexRouter)

}

module.exports = route