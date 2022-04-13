class LienHeController {
    async index(req,res){
        var cart = req.session.cart
        const currentUser = await req.user
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser && currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        res.render('user/lienHe',{
            currentUser: currentUser,
            cart: cart
        });
    }
}

module.exports = new LienHeController;