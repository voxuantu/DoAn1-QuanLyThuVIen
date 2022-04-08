const {bufferUpload} = require('../../utils/uploadImage')
const Account = require('../../models/account')
const BorrowBookTicket = require('../../models/borrowBookTicket')
const Regulation = require('../../models/regulation')
const LibraryCard = require('../../models/libraryCard')

class TrangCaNhanController {
    async index(req, res) {
        const currentUser = await req.user
        if(currentUser.role.name == 'USER'){
            const libraryCard = await LibraryCard.findOne({accountId: currentUser._id})
            var cart = req.session.cart
            const borrowBookCard = await BorrowBookTicket.aggregate().match({libraryCard: libraryCard._id}).lookup({
                from: 'detailborrowbooks',
                localField: '_id',
                foreignField: 'borrowBookTicketId',
                as: 'bookBorrowed'
            })
            const maxBorrowDates = await Regulation.findOne({name: 'Số ngày mượn tối đa/1 lần mượn'})
            res.render('user/trangCaNhan', { 
                currentUser: currentUser,
                cart: cart,
                borrowBookCard: borrowBookCard,
                maxBorrowDates: maxBorrowDates.value
            });
        }else{
            res.render('staff/trangCaNhanStaff',{
                currentUser: currentUser
            })
        }
    }

    //update user
    async update(req, res) {
        //res.send('test edit user')
        let user
        try {
            user = await Account.findById(req.params.id)
            if(req.file != null){
                const { buffer } = req.file;
                const { secure_url } = await bufferUpload(buffer);
                user.img = secure_url
            }
            user.displayName = req.body.displayName,
            user.address = req.body.address,
            user.email = req.body.email,
            user.phone = req.body.phone,
            user.birth = new Date(req.body.birth)

            await user.save()
            res.redirect('/trangCaNhan')
        } catch (error) {
            console.log(error)
            res.send("Something went wrong please try again later..");
        }
    }
}

module.exports = new TrangCaNhanController;