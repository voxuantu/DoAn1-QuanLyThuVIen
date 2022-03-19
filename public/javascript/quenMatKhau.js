var form1 = document.getElementById('form1')
var form2 = document.getElementById('form2')

var next = document.getElementById('next')
var back = document.getElementById('back')

next.onclick = function () {
    $.ajax({
        url: '/api/kiemTraNguoiDung',
        dataType: 'json',
        type: 'post',
        data: {
            username: $('#username').val()
        },
        success: function (data) {
            if (data == "Không tìm thấy user") {
                Swal.fire('Thất bại!', 'Tên đăng nhập không tồn tại!', 'error')
            } else {
                $('#userId').val(data)
                form1.style.left = "-450px";
                form2.style.left = "0px";
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}

back.onclick = function () {
    form1.style.left = "0px";
    form2.style.left = "450px";
}

$(document).ready(function () {
    $('#layMa').click(function () {
        $.ajax({
            url: '/api/layMa',
            dataType: 'json',
            type: 'post',
            data: {
                id: $('#userId').val()
            },
            success: function (data) {
                Swal.fire('Mã đã được gửi!', 'Hãy vào email của bạn để lấy mã!', 'success')
            },
            error: function (err) {
                console.log(err)
            }
        })
        $('#xacnhan').click(function () {
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
                            Swal.fire('Thành công!', 'Đổi mật khẩu thành công!', 'success').then((result) => {
                                if (result.isConfirmed) {
                                    window.location.replace('/dangNhap')
                                }
                            })
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
})