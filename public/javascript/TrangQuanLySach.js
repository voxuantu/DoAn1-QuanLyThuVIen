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
})

Validator({
    form : '#FormThemMoi',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormThemMoi #tensach'),
        Validator.isRequire('#FormThemMoi #tacgia'),
        Validator.isRequire('#FormThemMoi #nhaxuatban'),
        Validator.isRequire('#FormThemMoi #theloai'),
        Validator.isRequire('#FormThemMoi #sotrang'),
        Validator.isRequire('#FormThemMoi #namxuatban'),
        Validator.isRequire('#FormThemMoi #giabia'),
        Validator.isRequire('#FormThemMoi #soluong'),
        Validator.isRequire('#FormThemMoi #mota'),
        Validator.isRequire('#FormThemMoi #imgUpload',"Vui lòng chọn ảnh bìa cho sách"),
    ]
});

Validator({
    form : '#FormChinhSua',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormChinhSua #tensach'),
        Validator.isRequire('#FormChinhSua #tacgia'),
        Validator.isRequire('#FormChinhSua #nhaxuatban'),
        Validator.isRequire('#FormChinhSua #theloai'),
        Validator.isRequire('#FormChinhSua #sotrang'),
        Validator.isRequire('#FormChinhSua #namxuatban'),
        Validator.isRequire('#FormChinhSua #giabia'),
        Validator.isRequire('#FormChinhSua #soluong'),
        Validator.isRequire('#FormChinhSua #mota'),
    ]
});