if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cloudinary = require('cloudinary').v2;


const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const initializePassport = require('./utils/passport-config')
initializePassport(passport)

const route = require('./routes/index')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.set('socketio', io);

app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

route(app)

io.on('connection', (socket) => {
    console.log('make socket connection ' + socket.id);

    socket.on('send-notification', data => {
        console.log("send data for create notification")
        console.log(data)
        console.log(socket.id)
        socket.broadcast.emit('show-notification', {title : data.title, message : data.message, socketId : socket.id})
    });
    socket.on('send-notification-to-special-client', data => {
        console.log("send data for create notification")
        console.log(data)
        console.log(socket.id)
        socket.to(data.socketId).emit('show-notification-from-admin', data)
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

//app.listen(process.env.PORT || 3000)
server.listen(process.env.PORT || 3000)