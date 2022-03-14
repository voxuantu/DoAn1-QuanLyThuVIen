function OpenImgDialog() {
    $(document).ready(function () {
        $('#imgUpload').trigger('click');
    })
}

function ShowImage(event) {
    var image = document.getElementById('anhBia');
    image.src = URL.createObjectURL(event.target.files[0]);
}

$(document).ready(function () {
    $('.delete-book').each(function (j, obj) {
        $(this).click(function () {
            var id = $(this).attr('data-id-book')
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
                        url: '/quanLySach/delete',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            window.location.replace("/quanLySach/1");
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                }
            })
        })
    })
})