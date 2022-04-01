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
function OpenModal(bookBorrow, status, borrowBookTicket, numberOfRenewals) {
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
                if(borrowBookTicket.numberOfRenewals < numberOfRenewals){
                    var addButton = `<button type="submit" class="nutbam">Xác nhận gia hạn</button>`
                    $('.modal-dang-muon-sach .modal-footer').append(addButton)
                }
                $('.modal-dang-muon-sach').modal('show');
            }else if ( status == "Đã trả"){
                $(".modal-tra-sach tbody tr").remove()
                for (let i = 0; i < bookBorrow.length; i++) {
                    const book = bookBorrow[i].bookId;
                    var trangThai
                    if(bookBorrow[i].status == "Đã trả"){
                        trangThai = `<mark class="da-tra">Đã trả</mark>`
                    }else if(bookBorrow[i].status == "Hư hỏng" || bookBorrow[i].status == "Làm mất"){
                        trangThai = `<mark class="dan-xu-ly">Đã trả</mark>`
                    }
                    markup = `<tr>
                                <td scope="row">
                                    ${i+1}
                                </td>
                                <td>
                                    <img src="${book.coverImage}" alt="${book.name}" class="img-fluid">
                                </td>
                                <td>${book.name}</td>
                                <td>${trangThai}</td>
                            </tr>`
                    $('.modal-tra-sach tbody').append(markup)
                }
                $('.modal-tra-sach').modal('show');
            }
        }
    )
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
                    OpenModal(data.bookBorrow, status, data.borrowBookTicket, data.numberOfRenewals)
                },
                error : function(err){
                    console.error(err)
                }
            })
        })
    })
})
