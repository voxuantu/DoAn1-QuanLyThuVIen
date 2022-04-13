var socket = io()
socket.on('show-notification-from-admin', function (data) {
    appendNotification(data)
})

function appendNotification(data) {
    var num = $('#notify-box li:first-child h2 span').text()
    $('#notify-box li:first-child h2 span').text(parseInt(num) + 1)
    $('#dropdownNotify span').text(parseInt(num) + 1)
    var content = "<li>"
        + "<a onclick='ViewNotification(this)' data-bs-id='" + data.id + "'>"
        + "<div class='notifi-item'>"
        + "<img class='img-fluid rounded-circle ms-2 me-3' src='/icon/avatar.png' alt='avatar'>"
        + "<div>"
        + "<h5>" + data.title + "</h5>"
        + "<p>" + data.message + "</p>"
        + "</div>"
        + "</div>"
        + "</a>"
        + "</li>"
    $('#notify-box').append(content)
}