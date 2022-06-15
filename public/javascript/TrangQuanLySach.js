$(document).ready(function () {
    var dataTable = $('#table-sach').DataTable();
    $('#searchBox').keyup(function () {
        dataTable.search(this.value).draw()
    })
});

function OpenImgDialog() {
    $(document).ready(function () {
        $('#imgUpload').trigger('click');
    })
}

function ShowImage(event) {
    var image = document.getElementById('anhBia');
    image.src = URL.createObjectURL(event.target.files[0]);
}

function deleteBook(a) {
    var id = a.getAttribute('data-id-book')
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
}


function OpenQRCode(a) {
    var id = a.getAttribute('data-id-book')
    $.ajax({
        url: '/api/getQRcode',
        dataType: 'json',
        type: 'post',
        data: {
            id: id
        },
        success: function (data) {
            $('.modal-QRCode .modal-footer button').remove()
            var img = document.getElementById('qrcode')
            img.setAttribute('src', data.url)
            var name = data.name
            var html = `<button class="nutbam" onclick="downloadQRCode('${name}','${id}')">Tải QRCode</button>`
            $('.modal-QRCode .modal-footer').append(html)
        },
        error: function (err) {
            console.log(err)
        }
    })
    $('#modalQrCode').modal('show')
}
function downloadQRCode(name, id) {
    $.ajax({
        url: '/api/saveQRcode',
        type: 'post',
        data: {
            id: id,
            name: name
        },
        success: function () {
            var url = '/images/QRCode/' + name + '.png'
            fetch(url, {
                mode: 'no-cors',
            })
                .then(response => response.blob())
                .then(blob => {
                    let blobUrl = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.download = url.replace(/^.*[\\\/]/, '');
                    a.href = blobUrl;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    deleteImage(name)
                })
        }
    })
}

function OpenChooseDialog(){
    $(document).ready(function () {
        $('#chooseFileDialog').trigger('click');
    })
}
function OnChange(){
    var form = document.getElementById('formImportExcel')
    var formData = new FormData(form)
    $.ajax({
        url: '/quanLySach/excelUpload',
        type: 'post',
        data: formData,
        success: function (data) {
            console.log(data)
            if(data.type == 'success'){
                window.location.replace(data.url)
                console.log('success')
            } else {
                Swal.fire('Thất bại!', 'Đã có lỗi xảy ra trong quá trình thêm sách!', 'error')
                console.log('fail')
            }
        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function deleteImage(name) {
    $.ajax({
        url: '/api/deleteQRcode',
        type: 'post',
        data: {
            name: name
        },
        success: function (data) { },
        error: function (err) {
            console.log(err)
        }
    })
}


Validator({
    form: '#FormThemMoi',
    formGroupSelector: '.form-group',
    errorSelector: '.errorMessage',
    rules: [
        Validator.isRequire('#FormThemMoi #tensach'),
        Validator.isRequire('#FormThemMoi #tacgia'),
        Validator.isRequire('#FormThemMoi #nhaxuatban'),
        Validator.isRequire('#FormThemMoi #theloai'),
        Validator.isRequire('#FormThemMoi #sotrang'),
        Validator.isRequire('#FormThemMoi #namxuatban'),
        Validator.isRequire('#FormThemMoi #giabia'),
        Validator.isRequire('#FormThemMoi #soluong'),
        Validator.isRequire('#FormThemMoi #mota'),
        Validator.isRequire('#FormThemMoi #imgUpload', "Vui lòng chọn ảnh bìa cho sách"),
    ]
});

Validator({
    form: '#FormChinhSua',
    formGroupSelector: '.form-group',
    errorSelector: '.errorMessage',
    rules: [
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