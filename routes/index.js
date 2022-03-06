const indexRouter = require('./home');
const staffRouter = require('./staff');
const loginRouter = require('./login');
const {checkAuthenticated} = require('../middleware/baseAuth')

function route (app) {
    app.use('/', indexRouter)
    app.use('/staff',checkAuthenticated, staffRouter)
    app.use('/login', loginRouter)
}

module.exports = route