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
            $(".thongtincanhan input.form-control").each(function (i, obj) {
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
            $(".thongtincanhan input.form-control").each(function (i, obj) {
                obj.classList.remove('hide-element')
            })
        })

        down = true;
    }
}
function OpenModal(mamuonsach, matrangthai) {
    $(document).ready(
        function () {
            if (matrangthai != 2) {

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
        $.ajax({
            url: '/api/doiMatKhau',
            dataType: 'json',
            type: 'post',
            data: {
                userId: $('#userId').val(),
                newpass: $('#newpass').val(),
                code: $('#code').val()
            },
            success: function (data) {
                switch (data) {
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
