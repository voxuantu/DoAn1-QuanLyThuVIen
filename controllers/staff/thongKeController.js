const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')

class ThongKeController {
    async index(req,res){
        const currentUser = await req.user
        var io = req.app.get('socketio')
        io.on('connection', (socket) => {
            if(currentUser.role.name == 'USER'){
                var roomName = currentUser._id.toString()
                socket.join(roomName)
            }
            //console.log(socket.rooms);
        
            socket.on('disconnect', () => {
                //console.log('user disconnected');
            });
        });
        var data = []
        let date = new Date()
        let monday = new Date()
        switch (date.getDay()) {
            case 0:
                monday.setDate(date.getDate() - 6)
                break;
            case 1: 
                monday.setDate(date.getDate())
                break;
            case 2: 
                monday.setDate(date.getDate() - 1)
                break;
            case 3: 
                monday.setDate(date.getDate() - 2)
                break;
            case 4: 
                monday.setDate(date.getDate() - 3)
                break;
            case 5: 
                monday.setDate(date.getDate() - 4)
                break;
            case 6: 
                monday.setDate(date.getDate() - 5)
                break;
            default:
                break;
        }
        let sunday = new Date()
        switch (date.getDay()) {
            case 0:
                sunday.setDate(date.setDate())
                break;
            case 1:  
                sunday.setDate(date.getDate() + 6)
                break;
            case 2: 
                sunday.setDate(date.getDate() + 5)
                break;
            case 3: 
                sunday.setDate(date.getDate() + 4)
                break;
            case 4: 
                sunday.setDate(date.getDate() + 3)
                break;
            case 5: 
                sunday.setDate(date.getDate() + 2)
                break;
            case 6: 
                sunday.setDate(date.getDate() + 1)
                break;
            default:
                break;
        }
        const chiTietMuonSach = await DetailBorrowBookTicket.find({})
                                            .populate({
                                                path: 'borrowBookTicketId',
                                                match: {dateBorrow: {$gte: monday, $lte: sunday}},
                                                select: 'dateBorrow'
                                            })
                                            .populate('bookId', 'name')
        chiTietMuonSach.forEach(e => {
            var isExist = false
           for (let i = 0; i < data.length; i++) {
               if(data[i].bookName == e.bookId.name){
                   data[i].count +=1
                   isExist = true
               }
           }
           if(!isExist){
               var row = {
                   bookName: e.bookId.name,
                   count : 1
               }
               data.push(row)
           }
        });

        if(data.length > 10){
            data = data.slice(0,10)
        }

        res.render('staff/thongKe',{
            currentUser: currentUser,
            data: data
        });
    }
}

module.exports = new ThongKeController;