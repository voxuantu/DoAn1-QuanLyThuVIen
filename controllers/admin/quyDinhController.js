const Regulation = require('../../models/regulation')

class QuyDinhController {
    async index(req,res){
        const currentUser = await req.user
        const regulations = await Regulation.find({})
        var suaThanhCong = req.session.suaThanhCong
        req.session.suaThanhCong = false
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser.email

                const clients = io.sockets.adapter.rooms.get(roomName)
                const numClients = clients ? clients.size : 0
                if(numClients == 0){
                    socket.join(roomName)
                }
            }
        
            socket.on('disconnect', () => {
                if(currentUser && currentUser.role.name == 'USER'){
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
            });
        });
        res.render('admin/quyDinh',{
            currentUser: currentUser,
            regulations: regulations,
            suaThanhCong: suaThanhCong
        });
    }
    async create(req,res){
        try {
            const regulation = new Regulation({
                name: req.body.name,
                value: req.body.value
            })
            await regulation.save()
            res.redirect('/quyDinh')
        } catch (error) {
            console.log(error)
        }
    }

    async update(req,res){
        let regulation
        try {
            regulation =await Regulation.findById(req.params.id)
            regulation.value = req.body.value
            await regulation.save()
            req.session.suaThanhCong = true
            res.redirect('/quyDinh')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new QuyDinhController;