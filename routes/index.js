
//Route Staff
const muonTraSachRouter = require('./staff/muonTraSachRouter')
const thongKeRouter = require('./staff/thongKeRouter')
const quanLySachRouter = require('./staff/quanLySach');
const quanLyTheLoaiRouter = require('./staff/quanLyTheLoai');

//Route User
const indexRouter = require('./user/home')
const loginRouter = require('./user/login')
const gioiThieuRouter = require('./user/gioiThieuRouter')
const lienHeRouter = require('./user/lienHeRouter')
const quenMatKhauRouter = require('./user/quenMatKhauRouter')
const trangCaNhanRouter = require('./user/trangCaNhanRouter')

const {checkAuthenticated} = require('../middleware/baseAuth')
const {checkPermissions} = require('../middleware/baseAuth');

function route (app) {
    app.use('/', indexRouter)
    app.use('/login', loginRouter)
    app.use('/quanlysach',checkAuthenticated, checkPermissions(['ADMIN']), quanLySachRouter)
    app.use('/quanlytheloai', checkAuthenticated, checkPermissions(['ADMIN']), quanLyTheLoaiRouter)
    app.use('/muonTraSach', muonTraSachRouter)
    app.use('/gioiThieu', gioiThieuRouter)
    app.use('/lienHe', lienHeRouter)
    app.use('/quenMatKhau', quenMatKhauRouter)
    app.use('/thongKe', thongKeRouter)
    app.use('/trangCaNhan',trangCaNhanRouter)
}

module.exports = route