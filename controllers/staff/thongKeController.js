const DetailBorrowBookTicket = require('../../models/detailBorrowBookTicket')
const BorrowBookTicket = require('../../models/borrowBookTicket')
const Book = require('../../models/book')

class ThongKeController {
    async index(req,res){
        const currentUser = await req.user
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
                if (currentUser && currentUser.role.name == 'USER') {
                    var roomName = currentUser.email
                    socket.leave(roomName)
                }
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
        var monday1 = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate())
        console.log('Monday1 '+monday1)

        const phieuMuonSachTrongTuan = await BorrowBookTicket.find({dateBorrow: {$gte: monday1}})
        var phieuMuonSachTrongTuan1 = []
        phieuMuonSachTrongTuan.forEach(e => {
            phieuMuonSachTrongTuan1.push(e._id)
        });
        const chiTietPhieuMuonSachTrongTuan = await DetailBorrowBookTicket.find({borrowBookTicketId: phieuMuonSachTrongTuan1})
                                                                            .populate('bookId', 'name')
        chiTietPhieuMuonSachTrongTuan.forEach(e => {
            var isExist = false
            for (let i = 0; i < data.length; i++) {
                if (data[i].bookName == e.bookId.name) {
                    data[i].count += 1
                    isExist = true
                }
            }
            if (!isExist) {
                var row = {
                    bookName: e.bookId.name,
                    count: 1
                }
                data.push(row)
            }
        });

        if(data.length > 10){
            data = data.slice(0,10)
        }
        data.sort((a,b) => b.count - a.count);
        //Lấy sách làm mất/hư hỏng theo tháng
        var month = date.getMonth()
        var begin = new Date(date.getFullYear(), month, 1)
        var end = new Date(date.getFullYear(), month+1, 1)
        const lostBook = await DetailBorrowBookTicket.aggregate([
            {
                $match:{ 
                    status: "Hư hỏng/mất",
                    dateGiveBack: {$gte: begin, $lt: end}
                }
            },
            {
                $group:{
                    _id: "$bookId",
                    count: {$sum: 1}
                }
            }   
        ])
        var sachMat = []
        for (let i = 0; i < lostBook.length; i++) {
            const e = lostBook[i];
            const b = await Book.findById(e._id)
            var row = {
                bookName : b.name,
                lostNumber: e.count
            }
            sachMat.push(row)
        }
        res.render('staff/thongKe',{
            currentUser: currentUser,
            data: data,
            sachMat: sachMat,
            month: month+1
        });

    }
}

module.exports = new ThongKeController;