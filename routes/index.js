const indexRouter = require('./home');
const staffRouter = require('./staff');
const loginRouter = require('./login');
const quanLySachRouter = require('./staff/quanLySach');
const quanLyTheLoaiRouter = require('./staff/quanLyTheLoai');
const {checkAuthenticated} = require('../middleware/baseAuth');
const {checkPermissions} = require('../middleware/baseAuth');

function route (app) {
    app.use('/', indexRouter)
    app.use('/staff',checkAuthenticated, staffRouter)
    app.use('/login', loginRouter)
    app.use('/quanlysach',checkAuthenticated, checkPermissions(['ADMIN']), quanLySachRouter)
    app.use('/quanlytheloai', checkAuthenticated, checkPermissions(['ADMIN']), quanLyTheLoaiRouter)
}

module.exports = route