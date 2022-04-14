var form1 = document.getElementById('form1')
var form2 = document.getElementById('form2')

var next = document.getElementById('next')
var back = document.getElementById('back')

Validator({
    form: '#form1',
    formGroupSelector : '.form-group',
    errorSelector: '.errorMessage',
    rules: [
        Validator.isRequire('#username')
    ],
    onSubmit: function (data) {
        $.ajax({
            url: '/api/kiemTraNguoiDung',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data1) {
                if (data1 == "Không tìm thấy user") {
                    Swal.fire('Thất bại!', 'Tên đăng nhập không tồn tại!', 'error')
                } else {
                    $('#form2 #userId').val(data1)
                    form1.style.left = "-450px";
                    form2.style.left = "0px";
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
});


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
            success: function (data1) {
                Swal.fire('Mã đã được gửi!', 'Hãy vào email của bạn để lấy mã!', 'success')
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
    var newpass = document.getElementById('newpass')
    var renewpass = document.getElementById('renewpass')
    var showhidenewpass = document.getElementById('show-hide-newpass')
    var showhiderenewpass = document.getElementById('show-hide-renewpass')
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

Validator({
    form: '#form2',
    formGroupSelector : '.form-group',
    errorSelector: '.errorMessage',
    rules: [
        Validator.isRequire('#newpass'),
        Validator.isFormatPassword('#newpass', "Mật khẩu phải chứa ít nhất 8 kí tự bao gồm kí tự đặc biêt, kí tự hoa, kí tự thường và số"),
        Validator.isRequire('#renewpass'),
        Validator.isConfirmed('#renewpass', function () {
            return document.querySelector('#form2 #newpass').value;
        }, "Mật khẩu nhập lại không đúng"),
        Validator.isRequire('#code')
    ],
    onSubmit: function (data) {
        $.ajax({
            url: '/api/doiMatKhau',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data1) {
                switch (data1) {
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
    }
});