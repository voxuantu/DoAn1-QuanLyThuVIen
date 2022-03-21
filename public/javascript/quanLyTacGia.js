$(document).ready(
    $('.edit-author').each(function (i, obj) {
        $(this).click(function () {
            var idTacGia = $(this).attr('data-id-tacgia')
            var tenTacGia = $(this).attr('data-ten-tacgia')
            $('.modal-body #tenTacGia').val(tenTacGia)
            $('.modal-body #idTacGia').val(idTacGia)
            $('.modal').modal('show');
        })
    })
)

$(document).ready(
    $('.delete-author').each(function (i, obj) {
        $(this).click(function () {
            var idTacGia = $(this).attr('data-id-tacgia')

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
                        url: '/quanLyTacGia/delete',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: idTacGia
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

function HienFormThemTacGia() {
    document.getElementById('themtacgia').classList.remove('hide-element');
}

Validator({
    form : '#FormThemMoi',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormThemMoi #tentacgia')
    ]
});

Validator({
    form : '#FormChinhSua',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormChinhSua #tenTacGia')
    ]
});