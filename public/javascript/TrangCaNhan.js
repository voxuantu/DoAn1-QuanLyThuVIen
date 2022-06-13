$(function(){
    $("div.rating.reader i").each(function (i, object) {
        $(this).click(function () {
            $('#voteStart').val(i+1)
            for (var j = 0; j < 5; j++) {
                var id = "star" + (j + 1).toString();
                if (j <= i) {
                    var element = document.getElementById(id);
                    element.classList.remove("fa-star-o");
                    element.classList.add("fa-star");
                    element.classList.add("yellowstar");
                } else {
                    var element = document.getElementById(id);
                    element.classList.remove("fa-star");
                    element.classList.remove("yellowstar");
                    element.classList.add("fa-star-o");
                }
            }
        })
    })
})
$(document).ready( function () {
    $('#table-lich-su-muon-sach').DataTable();
} );

var down = false;

function toggleEdit() {

    if (down) {
        document.getElementById('nuteditThongTin').classList.remove("display-edit-button");

        $(document).ready(function () {
            $(".thongtincanhan label.tieude").each(function (i, obj) {
                obj.classList.remove('hide-element')
            })
        })
        $(document).ready(function () {
            $(".thongtincanhan input.field").each(function (i, obj) {
                obj.classList.add('hide-element')
            })
        })
        down = false;
    } else {
        document.getElementById('nuteditThongTin').classList.add("display-edit-button");

        $(document).ready(function () {
            $(".thongtincanhan label.tieude").each(function (i, obj) {
                obj.classList.add('hide-element')
            })
        })
        $(document).ready(function () {
            $(".thongtincanhan input.field").each(function (i, obj) {
                obj.classList.remove('hide-element')
            })
        })

        down = true;
    }
}
function OpenModal(bookBorrow, status, borrowBookTicket, numberOfRenewals, fine, numberOfDateToBorrwoBook) {
    $(document).ready(
        function () {
            if(status == "Đang xử lý"){
                $(".modal-dang-xu-ly tbody tr").remove()
                for (let i = 0; i < bookBorrow.length; i++) {
                    const book = bookBorrow[i].bookId;
                    markup = `<tr><td scope="row">${i+1}</td><td><img src="${book.coverImage}" alt="${book.name}" class="img-fluid"></td><td>${book.name}</td></tr>`
                    $('.modal-dang-xu-ly tbody').append(markup)
                }
                $('.modal-dang-xu-ly').modal('show');
            }else if ( status == "Đang mượn"){
                $(".modal-dang-muon-sach tbody tr").remove()
                $(".modal-dang-muon-sach .modal-footer button").remove()
                for (let i = 0; i < bookBorrow.length; i++) {
                    const book = bookBorrow[i].bookId;
                   
                    markup = `<tr>
                                <td scope="row">
                                    ${i+1}
                                </td>
                                <td>
                                    <img src="${book.coverImage}" alt="${book.name}" class="img-fluid">
                                </td>
                                <td>${book.name}</td>
                            </tr>`
                    $('.modal-dang-muon-sach tbody').append(markup)
                }
                $('#borrowBookTicketId').val(borrowBookTicket._id)
                console.log(numberOfRenewals)
                console.log(borrowBookTicket.numberOfRenewals)
                console.log(borrowBookTicket.numberOfRenewals < numberOfRenewals)
                if(borrowBookTicket.numberOfRenewals < numberOfRenewals && addDates(borrowBookTicket.dateBorrow, numberOfDateToBorrwoBook.value) >= new Date()){
                    var addButton = `<button type="submit" class="nutbam">Xác nhận gia hạn</button>`
                    $('.modal-dang-muon-sach .modal-footer').append(addButton)
                }
                $('.modal-dang-muon-sach').modal('show');
            }else if ( status == "Đã trả" || status == "Trễ hẹn"){
                $(".modal-tra-sach tbody tr").remove()
                for (let i = 0; i < bookBorrow.length; i++) {
                    const book = bookBorrow[i].bookId;
                    var trangThai
                    if(bookBorrow[i].status == "Đã trả"){
                        trangThai = `<mark class="da-tra">Đã trả</mark>`
                    }else if(bookBorrow[i].status == "Hư hỏng/mất"){
                        trangThai = `<mark class="dang-xu-ly">Hư hỏng/mất</mark>`
                    }
                    var binhLuan
                    if(bookBorrow[i].isComment){
                        binhLuan = `<span>Đã bình luận</span>`
                    }else{
                        binhLuan = `<button class="nutbam" onclick="OpenModalBinhLuan('${book._id}','${bookBorrow[i]._id}')">Bình luận</button>`
                    }
                    markup = `<tr>
                                <td>
                                    <img src="${book.coverImage}" alt="${book.name}" class="img-fluid">
                                </td>
                                <td>${book.name}</td>
                                <td>${trangThai}</td>
                                <td>${new Date(bookBorrow[i].dateGiveBack).toLocaleDateString('vi-VN')}</td>
                                <td>${binhLuan}</td>
                            </tr>`
                    $('.modal-tra-sach tbody').append(markup)
                    $('.modal-tra-sach #thong-tin-khac #ngay-muon p:nth-child(2)').text(new Date(borrowBookTicket.dateBorrow).toLocaleDateString('vi-VN'))
                    $('.modal-tra-sach #thong-tin-khac #han-tra p:nth-child(2)').text(AddDate(borrowBookTicket.dateBorrow, 7).toLocaleDateString('vi-VN'))
                    $('.modal-tra-sach #thong-tin-khac #tinh-trang p:nth-child(2)').text(borrowBookTicket.statusBorrowBook)
                    $('.modal-tra-sach #thong-tin-khac #tien-phat p:nth-child(2)').text(fine.toLocaleString('vi-VN') + " đ")

                }
                $('.modal-tra-sach').modal('show');
            }
        }
    )
}

function AddDate(date, num){
    var currentDateObj = new Date(date);
    var numberOfMlSeconds = currentDateObj.getTime();
    var addMlSeconds = 60 * 60 * 1000 * 24 * num;
    var newDateObj = new Date(numberOfMlSeconds + addMlSeconds);
    return newDateObj
}

function OpenModalChangePass() {
    $(document).ready(
        function () {
            $('.modal-change-password').modal('show');
        }
    )
}
function OpenModalTraSach() {
    $(document).ready(
        function () {
            $('.modal-tra-sach').modal('show');
        }
    )
}

function ShowImage(event) {
    var avatar = document.getElementById('avatar')
    avatar.src = URL.createObjectURL(event.target.files[0])
}

function OpenImgDialog() {
    $(document).ready(function () {
        $('#imgUpload').trigger('click');
    })
}

function OpenModalBinhLuan(bookId,detailBorrowBookId){
    $(document).ready(
        function () {
            $('.modal-binh-luan-sach').modal('show');
            $('#bookId').val(bookId);
            $('#detailBorrowBookId').val(detailBorrowBookId);
        }
    )
}

$(document).ready(function () {
    $('#layMa').click(function () {
        $.ajax({
            url: '/api/layMa',
            dataType: 'json',
            type: 'post',
            data: {
                id: $(this).attr('data-id-user')
            },
            success: function (data) {
                Swal.fire('Mã đã được gửi!', 'thành công!', 'success')
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    $('#ThayDoi').click(function () {
        
    })
})

Validator({
    form : '#FormChinhSua',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormChinhSua #displayName'),
        Validator.isRequire('#FormChinhSua #birth'),
        Validator.isRequire('#FormChinhSua #sodt'),
        Validator.isNumber('#FormChinhSua #sodt', "Số điện thoại phải là kiểu số"),
        Validator.minLength('#FormChinhSua #sodt', 10, "Số điện thoại bao gồm 10 chữ số"),
        Validator.maxLength('#FormChinhSua #sodt', 10, "Số điện thoại bao gồm 10 chữ số"),
        Validator.isRequire('#FormChinhSua #diachi'),
        Validator.isRequire('#FormChinhSua #email'),
        Validator.isEmail('#FormChinhSua #email'),
    ]
});

Validator({
    form : '#FormDoiMatKhau',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormDoiMatKhau #newpass'),
        Validator.isFormatPassword('#FormDoiMatKhau #newpass', "Mật khẩu phải chứa ít nhất 8 kí tự bao gồm kí tự đặc biêt, kí tự hoa, kí tự thường và số"),
        Validator.isRequire('#FormDoiMatKhau #code'),
        Validator.isConfirmed('#renewpass', function () {
            return document.querySelector('#FormDoiMatKhau #newpass').value;
        }, "Mật khẩu nhập lại không đúng"),
        Validator.isRequire('#FormDoiMatKhau #renewpass'),

    ],
    onSubmit : function(data){
        $.ajax({
            url: '/api/doiMatKhau',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data1) {
                switch (data1) {
                    case "Thành công":
                        Swal.fire('Thành công!', 'Đổi mật khẩu thành công!', 'success')
                        break;
                    case "Mã không đúng":
                        Swal.fire('Mã không đúng!', 'Vui lòng nhập lại!', 'error')
                        break;
                    case "Mã đã hết hạn":
                        Swal.fire('Mã đã hết hạn!', 'Vui lòng lấy mã khác!', 'error')
                        break;
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
})



$(document).ready(function(){
    $('.js-view-detail').each(function(i,obj){
        var status = $(this).attr('data-status')
        var borrowBookTicketId = $(this).attr('data-book-borrowed')
        $(this).click(function(){
            $.ajax({
                url:'/api/layChiTietPhieuMuon',
                type:'post',
                data: {
                    id: $(this).attr('data-book-borrowed')
                },
                success: function(data){
                    OpenModal(data.bookBorrow, status, data.borrowBookTicket, data.numberOfRenewals, data.fine, data.numberOfDateToBorrwoBook)
                },
                error : function(err){
                    console.error(err)
                }
            })
        })
    })
    var newpass = document.getElementById('newpass')
    var renewpass = document.getElementById('renewpass')
    var showhidenewpass = document.getElementById('show-hid-newpass')
    var showhiderenewpass = document.getElementById('show-hid-renewpass')
    showhidenewpass.addEventListener('click', function(){
        if(newpass.type === "password"){
            newpass.type = 'text'
            showhidenewpass.classList.remove("fa-eye")
            showhidenewpass.classList.add("fa-eye-slash")
        } else {
            newpass.type = 'password'
            showhidenewpass.classList.remove("fa-eye-slash")
            showhidenewpass.classList.add("fa-eye")
        }
    })
    showhiderenewpass.addEventListener('click', function(){
        if(renewpass.type === "password"){
            renewpass.type = 'text'
            showhiderenewpass.classList.remove("fa-eye")
            showhiderenewpass.classList.add("fa-eye-slash")
        } else {
            renewpass.type = 'password'
            showhiderenewpass.classList.remove("fa-eye-slash")
            showhiderenewpass.classList.add("fa-eye")
        }
    })
})

function addDates(date, days){
    var result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}