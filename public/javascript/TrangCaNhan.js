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
function OpenModal(bookBorrow, status) {
    $(document).ready(
        function () {
            $(".modal-chi-tiet-muon-sach tbody tr").remove()
            for (let i = 0; i < bookBorrow.length; i++) {
                const book = bookBorrow[i].bookId;
                markup = `<tr><td scope="row">${i+1}</td><td><img src="${book.coverImage}" alt="${book.name}" class="img-fluid"></td><td>${book.name}</td></tr>`
                $('.modal-chi-tiet-muon-sach tbody').append(markup)
            }
            if (status != 2) {
                $('.modal-chi-tiet-muon-sach .nutbam').addClass('hide-element');
            } else {
                $('.modal-chi-tiet-muon-sach .nutbam').removeClass('hide-element');
            }
            $('.modal-chi-tiet-muon-sach').modal('show');
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
    })
})

$(document).ready(function(){
    $('.js-view-detail').each(function(i,obj){
        $(this).click(function(){
            $.ajax({
                url:'/api/layChiTietPhieuMuon',
                type:'post',
                data: {
                    id: $(this).attr('data-book-borrowed')
                },
                success: function(data){
                    OpenModal(data.bookBorrow,$(this).attr('data-status'))
                },
                error : function(err){
                    console.error(err)
                }
            })
        })
    })
})

