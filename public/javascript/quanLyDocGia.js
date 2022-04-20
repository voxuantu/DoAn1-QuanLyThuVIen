Validator({
    form : '#FormThemMoi',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormThemMoi #username'),
        Validator.isRequire('#FormThemMoi #password'),
        Validator.isRequire('#FormThemMoi #displayName'),
        Validator.isRequire('#FormThemMoi #address'),
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
        var gender = $('#gender').val()
        var phone = $('#phone').val()
        var email = $('#email').val()
        var birth = $('#birth').val()
        $.ajax({
            url: '/quanLyDocGia/themDocGia',
            type: 'post',
            data:{
                username: username,
                password: password,
                displayName: displayName,
                address: address,
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

$(document).ready(
    $('.js-block-user').each(function(i,obj){
        $(this).click(function(){
            var id = $(this).attr('data-user-id')

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: true
            })

            swalWithBootstrapButtons.fire({
                title: 'Bạn có muốn chặn người dùng này không?',
                text: "Tài khoản này sẽ bị vô hiệu hóa sau khi chặn",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/quanLyDocGia/chanDocGia',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            window.location.replace(data);
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                }
            })
        })
    }),
    $('.js-gia-han-the').each(function(i,obj){
        $(this).click(function(){
            var id = $(this).attr('data-library-card-id')

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: true
            })

            swalWithBootstrapButtons.fire({
                title: 'Bạn có muốn gia hạn thẻ thư viện cho độc giả này không?',
                text: "Thẻ thư viện của độc giả này sẽ được gia hạn sau khi bạn chọn có",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/quanLyDocGia/giaHanTheThuVien',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            window.location.replace(data);
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                }
            })
        })
    })
);


$(document).ready( function () {
    var dataTable = $('#table-doc-gia').DataTable();
    $('#searchBox').keyup(function(){
        dataTable.search(this.value).draw()
    })
} );