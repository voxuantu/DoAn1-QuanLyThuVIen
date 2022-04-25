$(document).ready(function () {
    $.ajax({
        url: '/api/layThongBaoDocGia',
        dataType: 'json',
        type: 'get',
        data: {},
        success: function (data1) {
            $('#notify-box li:first-child h2 span').text(data1.length)
            $('#dropdownNotify span').text(data1.length)
            console.log(data1)
            data1.forEach(element => {
                var content = "<li>"
                    + "<a onclick='ViewNotification(this)' data-bs-id='" + element._id + "'>"
                    + "<div class='notifi-item'>"
                    + "<img class='img-fluid rounded-circle ms-2 me-3' src='/icon/notification-bell.png' alt='avatar'>"
                    + "<div>"
                    + "<h5>" + element.title + "</h5>"
                    + "<p>" + element.message + "</p>"
                    + "</div>"
                    + "</div>"
                    + "</a>"
                    + "</li>"
                $('#notify-box').append(content)
            });
        },
        error: function (err) {
            console.log(err)
        }
    })
})
function ViewNotification(a) {
    var id = a.getAttribute('data-bs-id')
    $.ajax({
        url: '/api/checkThongBao',
        dataType: 'json',
        type: 'post',
        data: {
            id: id
        },
        success: function (data1) {
            if (data1 == 'success') {
                window.location.replace('/trangCaNhan')
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}