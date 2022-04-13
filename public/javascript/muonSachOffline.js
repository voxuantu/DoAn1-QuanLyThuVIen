var sach = []
function onScanSuccess(qrCodeMessage) {
    if (jQuery.inArray(qrCodeMessage, sach) < 0) {
        $.ajax({
            url: '/api/getABook',
            type: 'post',
            data: {
                id: qrCodeMessage
            },
            success: function (data) {
                if (data.quantity <= 0) {
                    Swal.fire('Thất bại!', `Sách ${data.name} không đủ số lượng!`, 'error')
                } else {
                    sach.push(qrCodeMessage)
                    var markup = `<tr id='${data._id}'>
                                  <td>${sach.length}</td>
                                  <td>
                                    <img src='${data.coverImage}' 
                                    alt='${data.name}' class='img-fluid'>
                                  </td>
                                  <td>${data.name}</td>
                                  <td><a class='js-delete-item-cart' onclick="deleteBook('${data._id}')"><i class='fa-solid fa-trash-can delete-item-cart'></i></a></td>
                                </tr>`
                    $('#table-sach tbody').append(markup)
                    $('#so-luong-sach').val(sach.length)
                }
            },
            error: function (err) {
                console.error(err)
            }
        })
    }
    //document.getElementById('result').innerHTML = '<span class="result">'+qrCodeMessage+'</span>';
}
function onScanError(errorMessage) {
    console.log(errorMessage)
}
var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess, onScanError);
function deleteBook(id) {
    var row = "#" + id
    $(row).remove()
    var index = sach.indexOf(id)
    if (index > -1) {
        sach.splice(index, 1)
    }
    if (sach.length == 0) {
        $('#so-luong-sach').val("")
    } else {
        $('#so-luong-sach').val(sach.length)
    }
}
Validator({
    form: '#form-muon-sach',
    formGroupSelector: '.form-group',
    errorSelector: '.errorMessage',
    rules: [
        Validator.isRequire('#libraryCard'),
        Validator.isRequire('#so-luong-sach', "Vui lòng chọn sách")
    ],
    onSubmit: function (data) {
        $.ajax({
            url: '/api/bookLoanConfirmation',
            dataType: 'json',
            type: 'post',
            data: {
                libraryCard: $('#libraryCard').val(),
                sachmuon: JSON.stringify(sach)
            },
            success: function (data1) {
                window.location.replace(data1)
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
});