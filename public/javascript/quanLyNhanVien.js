Validator({
    form : '#FormThemMoi',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormThemMoi #username'),
        Validator.isRequire('#FormThemMoi #password'),
        Validator.isRequire('#FormThemMoi #displayName'),
        Validator.isRequire('#FormThemMoi #address'),
        Validator.isRequire('#FormThemMoi #role'),
        Validator.isRequire('#FormThemMoi #gender'),
        Validator.isRequire('#FormThemMoi #phone'),
        Validator.isRequire('#FormThemMoi #email'),
        Validator.isEmail('#FormThemMoi #email'),
        Validator.isRequire('#FormThemMoi #birth'),
    ],
    onSubmit: function(data){
        var username = $('#username').val()
        var password = $('#password').val()
        var displayName = $('#displayName').val()
        var address = $('#address').val()
        var role = $('#role').val()
        var gender = $('#gender').val()
        var phone = $('#phone').val()
        var email = $('#email').val()
        var birth = $('#birth').val()
        $.ajax({
            url: '/quanLyNhanVien/themNhanVien',
            type: 'post',
            data:{
                username: username,
                password: password,
                displayName: displayName,
                address: address,
                role: role,
                gender: gender,
                phone: phone,
                email: email,
                birth: birth
            },
            success: function(data){
                if(data.type == 'That bai'){
                    Swal.fire({
                        icon: 'warning',
                        title: 'Thất bại',
                        text: data.message,
                    })
                }else if(data.type == 'Thanh cong'){
                    window.location.replace(data.message)
                }
            }
        })
    }
});

$(document).ready( function () {
    var dataTable = $('#table-nhan-vien').DataTable();
    $('#searchBox').keyup(function(){
        dataTable.search(this.value).draw()
    })
});