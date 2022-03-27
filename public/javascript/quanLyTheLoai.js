$(document).ready(
    $('.edit-category').each(function (i, obj) {
        $(this).click(function () {
            var idTheLoai = $(this).attr('data-id-theloai')
            var tenTheLoai = $(this).attr('data-ten-theloai')
            $('.modal-body #tenLoai').val(tenTheLoai)
            $('.modal-body #idLoai').val(idTheLoai)
            $('.modal').modal('show');
        })
    })
)

$(document).ready(
    $('.delete-category').each(function (i, obj) {
        $(this).click(function () {
            var idTheLoai = $(this).attr('data-id-theloai')
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: true
            })
            swalWithBootstrapButtons.fire({
                title: 'Bạn có muốn xóa không?',
                text: "Bạn sẽ không khôi phục lại được sau khi xóa!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/quanLyTheLoai/delete',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: idTheLoai
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
)

function HienFormThemTheLoai() {
    document.getElementById('themtheloai').classList.remove('hide-element');
}

Validator({
    form : '#FormThemMoi',
    formGroupSelector : '.form-field',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#categoryName')
    ]
});

Validator({
    form : '#FormChinhSua',
    formGroupSelector : '.form-field',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#tenLoai')
    ]
});