class GioiThieuController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser && currentUser.role.name == 'USER'){
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if(numClients == 0){
                    socket.join(roomName)
                }
            }
        
            socket.on('disconnect', () => {
                if (currentUser && currentUser.role.name == 'USER') {
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
            });
        });
        res.render('user/gioiThieu',{
            currentUser: currentUser,
            cart: cart
        });
    }
}

module.exports = new GioiThieuController;