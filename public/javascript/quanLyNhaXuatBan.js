$(document).ready(
    $('.edit-publisher').each(function (i, obj) {
        $(this).click(function () {
            var idNbx = $(this).attr('data-id-nbx')
            var tenNbx = $(this).attr('data-ten-nbx')
            $('.modal-body #tenNbx').val(tenNbx)
            $('.modal-body #idNbx').val(idNbx)
            $('.modal').modal('show');
        })
    })
)

$(document).ready(
    $('.delete-publisher').each(function (i, obj) {
        $(this).click(function () {
            var idNbx = $(this).attr('data-id-nbx')

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
                        url: '/quanLyNhaXuatBan/delete',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: idNbx
                        },
                        success: function (data) {
                            window.location.replace("/quanLyNhaXuatBan");
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

function HienFormThemNBX() {
    document.getElementById('themNBX').classList.remove('hide-element');
}