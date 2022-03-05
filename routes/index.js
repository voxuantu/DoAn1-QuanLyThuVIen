const indexRouter = require('./home');
const staffRouter = require('./staff');
const loginRouter = require('./login');

function route (app) {
    app.use('/',indexRouter)
    app.use('/staff', staffRouter)
    app.use('/login', loginRouter)
}

module.exports = route