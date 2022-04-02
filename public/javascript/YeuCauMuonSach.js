function OpenModal(bookBorrow) {
    $(document).ready(
        function () {
            $(".modalMuonSach tbody tr").remove()
            for (let i = 0; i < bookBorrow.length; i++) {
                const book = bookBorrow[i].bookId;
                markup = `<tr><td scope="row">${i + 1}</td><td><img src="${book.coverImage}" alt="${book.name}" class="img-fluid"></td><td>${book.name}</td></tr>`
                $('.modalMuonSach tbody').append(markup)
            }
            $('.modalMuonSach').modal('show');
        }
    )
}

function OpenModelTraSach(bookBorrow, hanTra, borrowTicketId) {
    $(document).ready(
        function () {
            $(".modalTraSach tbody tr").remove()
            for (let i = 0; i < bookBorrow.length; i++) {
                const book = bookBorrow[i].bookId
                markup = `<tr>
                                <td scope="row"><input class="form-check-input checksachtra" type="checkbox"></td>
                                <td><img src="${book.coverImage}" alt="${book.name}"
                                        class="img-fluid"></td>
                                <td>
                                    ${book.name}
                                    <input id="bookId" hidden value="${book._id}">
                                </td>
                                <td><input onchange="showPhatHuHong(this,${book.coverPrice})" name="lamhuhong" class="form-check-input lamhuhong" type="checkbox" value="" id=""></td>
                            </tr>`
                $('.modalTraSach tbody').append(markup)
            }

            markup = `<h5>Thông tin trả sách</h5>
                        <p>Hạn trả : ${hanTra}</p>
                        <p>Ngày trả : ${getDateNow()}</p>`
            if (isLate(hanTra) > 0) {
                markup += `<p>Trạng thái trả : <mark class="dang-xu-ly">Trễ hẹn</mark> (trễ <mark class="dang-xu-ly">${isLate(hanTra)}</mark> ngày)</p>
                        <div>
                            <p>Tiền phạt :</p>
                            <ul>
                                <li id="phattre">Phạt trễ hẹn : <span>20000<span></li>
                                <li id="phathuhong" class="hide-element">Phạt làm hư hỏng (làm mất sách) : <span>0<span></li>
                            </ul>
                        </div>`
            } else {
                markup += `<div id="phattien" class="hide-element">
                            <p>Tiền phạt :</p>
                            <ul>
                                <li id="phattre" class="hide-element">Phạt trễ hẹn : <span>0<span></li>
                                <li id="phathuhong" class="hide-element">Phạt làm hư hỏng (làm mất sách) : <span>0<span></li>
                            </ul>
                        </div>`
            }

            $('.modalTraSach .modal-body .col-sm-4').html(markup)

            $('.modalTraSach .js-xac-nhan-tra-sach').attr('data-borrowTicketId', borrowTicketId)
            $('.modalTraSach').modal('show');
        }
    )
}

function OpenModelDaTraSach() {
    $(document).ready(
        function () {
            $('.modalDaTraSach').modal('show');
        }
    )
}


function showPhatHuHong(cb, coverPrice) {
    var phat = document.getElementById("phattien");
    var phathuhong = document.getElementById("phathuhong");
    var tienPhat = $('#phathuhong span').text()

    if (cb.checked) {
        $('#phathuhong span').text(plusMoney(tienPhat, coverPrice))
        console.log(plusMoney(tienPhat, coverPrice))
        phathuhong.classList.remove("hide-element");

        if (phat != null) {
            phat.classList.remove("hide-element")
        }
        console.log('da cong')
    } else {
        var money = minusMoney(tienPhat, coverPrice)
        $('#phathuhong span').text(money)

        if (money == 0) {
            phathuhong.classList.add("hide-element")
            if (phat != null) {
                phat.classList.remove("hide-element")
            }
        }

        console.log(minusMoney(tienPhat, coverPrice))
    }
}

var checkAll = false;

function CheckAllBook() {
    $(document).ready(
        function () {
            if (checkAll) {
                $('.modalTraSach tbody input.checksachtra').each(function (i, obj) {
                    $(this).prop('checked', false);
                })
                checkAll = false;
            } else {
                $('.modalTraSach tbody input.checksachtra').each(function (i, obj) {
                    $(this).prop('checked', true);
                })
                checkAll = true;
            }
        }
    )
}

$(document).ready(function () {
    $('.js-modal-muon-sach').each(function (i, obj) {
        $(this).click(function () {
            $.ajax({
                url: '/api/layChiTietPhieuMuon',
                type: 'post',
                data: {
                    id: $(this).attr('data-book-borrowed')
                },
                success: function (data) {
                    OpenModal(data.bookBorrow)
                },
                error: function (err) {
                    console.error(err)
                }
            })
        })
    })
    $('.js-modal-tra-sach').each(function (i, obj) {
        $(this).click(function () {
            var hanTra = $(this).attr('data-han-tra')
            var borrowTicketId = $(this).attr('data-borrow-book-ticket-id')
            $.ajax({
                url: '/api/layChiTietPhieuMuon',
                type: 'post',
                data: {
                    id: borrowTicketId
                },
                success: function (data) {
                    OpenModelTraSach(data.bookBorrow, hanTra, borrowTicketId)
                },
                error: function (err) {
                    console.error(err)
                }
            })
        })
    })
    $('.js-xac-nhan-tra-sach').click(function () {
        var sachtra = []
        var rows = document.querySelectorAll(".modalTraSach tbody tr")
        rows.forEach(row => {
            var checkTraSach = row.querySelector(".checksachtra")
            if (checkTraSach.checked) {
                var data = {
                    id: row.querySelector("#bookId").value,
                    tinhtrang: row.querySelector(".lamhuhong").checked ? 'Hư hỏng/mất' : 'Đã trả'
                }
                sachtra.push(data)
            }
        });
        var tienPhatMuon = $('#phattre span').text()
        var tienPhatHuHong = $('#phathuhong span').text()
        var data = {
            sachtra: JSON.stringify(sachtra),
            tienphat: plusMoney(tienPhatMuon, tienPhatHuHong),
            borrowTicketId: $(this).attr('data-borrowTicketId')
        }
        $.ajax({
            url: '/muonTraSach/traSach',
            dataType: 'json',
            type: 'post',
            data: data,
            success: function (data1) {
                if ("Trả sách thành công") {
                    window.location.replace('/muonTraSach')
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    })
})

function getDateNow() {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    return today.toISOString().split('T')[0]
}

function isLate(hanTra) {
    const date1 = new Date(hanTra + "T00:00:00")
    console.log(date1)
    const date2 = new Date()
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24))
}

function plusMoney(oldMoney, addedMoney) {
    return parseInt(oldMoney) + parseInt(addedMoney)
}
function minusMoney(oldMoney, deductedMoney) {
    var result = parseInt(oldMoney) - parseInt(deductedMoney)
    if (result < 0) {
        return 0
    }
    return result
}