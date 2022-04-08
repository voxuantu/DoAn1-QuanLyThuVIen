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

function OpenModelTraSach(bookBorrow, hanTra, borrowTicketId, fine) {
    $(document).ready(
        function () {
            $(".modalTraSach tbody tr").remove()
            for (let i = 0; i < bookBorrow.length; i++) {
                const book = bookBorrow[i].bookId
                markup = `<tr>
                                <td scope="row">`
                if(bookBorrow[i].status == "Đã trả" || bookBorrow[i].status == "Hư hỏng/mất") {
                    markup += `<input class="form-check-input checksachtra" type="checkbox" disabled checked>`
                } else {
                    markup += `<input onchange="showPhatTre(this,${isLate(hanTra)})" class="form-check-input checksachtra" type="checkbox">`
                }          
                        markup+= `</td>
                                <td><img src="${book.coverImage}" alt="${book.name}"
                                        class="img-fluid"></td>
                                <td>
                                    ${book.name}
                                    <input id="bookId" hidden value="${book._id}">
                                </td>
                                <td>`
                if(bookBorrow[i].status == "Hư hỏng/mất") {
                    markup += `<input name="lamhuhong" class="form-check-input lamhuhong" type="checkbox" checked disabled>`
                } else if(bookBorrow[i].status == "Đã trả") {
                    markup += `<input name="lamhuhong" class="form-check-input lamhuhong" type="checkbox" disabled>`
                } else {
                    markup += `<input onchange="showPhatHuHong(this,${book.coverPrice})" name="lamhuhong" class="form-check-input lamhuhong" type="checkbox" value="" id="">`
                }              
                      markup += `</td>
                            </tr>`
                $('.modalTraSach tbody').append(markup)
            }

            markup = `<h5>Thông tin trả sách</h5>
                        <p>Hạn trả : ${hanTra}</p>
                        <p>Ngày trả : ${getDateNow()}</p>
                        <p id="state-give-back" class="hide-element">Trạng thái trả : <mark class="dang-xu-ly">Trễ hẹn</mark> (trễ <mark class="dang-xu-ly">${isLate(hanTra)}</mark> ngày)</p>
                        <div id="phattien">
                            <p>Tiền phạt :</p>
                            <ul>
                                <li id="phattre">Phạt trễ hẹn : <span>0<span></li>
                                <li id="phathuhong" >Phạt làm hư hỏng (làm mất sách) : <span>0<span></li>
                                <li id="daPhat" class=${fine ? "" : "hide-element"}>Đã phạt : <span>${fine}<span></li>
                            </ul>
                        </div>`
            
            $('.modalTraSach .modal-body .col-sm-4').html(markup)

            $('.modalTraSach .js-xac-nhan-tra-sach').attr('data-borrowTicketId', borrowTicketId)
            $('.modalTraSach').modal('show');
        }
    )
}

function OpenModelDaTraSach(data) {
    $(document).ready(
        function () {
            $(".modalDaTraSach tbody tr").remove()
            for (let i = 0; i < data.borrowedBooks.length; i++) {
                var markup = `<tr>
                                    <td><img src="${data.borrowedBooks[i].img}" alt="${data.borrowedBooks[i].bookName}"
                                            class="img-fluid"></td>
                                    <td>${data.borrowedBooks[i].bookName}</td>
                                    <td>${new Date(data.borrowedBooks[i].daveGiveBack).toLocaleDateString('vi-VN')}</td>
                                    <td>${data.borrowedBooks[i].state}</td>
                                </tr>`
                $(".modalDaTraSach tbody").append(markup)
            }
            var markup = `<h5>Thông tin khác</h5>
                    <p>Mã mượn sách : MS001</p>
                    <p>Họ và tên : ${data.reader}</p>
                    <p>Ngày mượn : ${new Date(data.dateBorrow).toLocaleDateString('vi-VN')}</p>
                    <p>Hạn trả : ${addDates(data.dateBorrow, 7).toLocaleDateString('vi-VN')}</p>
                    <p>Số sách trả : `
            if(data.numberOfReturnedBooks < data.numberOfBooksBorrowed){
                markup += `<mark class="dang-xu-ly">${data.numberOfReturnedBooks}/${data.numberOfBooksBorrowed}</mark>`
            } else {
                markup += `<mark class="da-tra">${data.numberOfReturnedBooks}/${data.numberOfBooksBorrowed}</mark>`
            }   
            markup +=`</p>`
            if(data.fineMoney != 0){
                markup +=  `<p>Số tiền phạt (nếu có) : ${(data.fineMoney).toLocaleString('vi-VN')} đ</p>`
            }
            $('.modalDaTraSach #thong-tin-khac').html("")
            $('.modalDaTraSach #thong-tin-khac').append(markup)
            $('.modalDaTraSach').modal('show')
        }
    )
}

function showPhatTre(cb, soNgayTre){
    if(soNgayTre > 0 ){
        var trangThaiTra = document.getElementById("state-give-back")
        var phatTre = document.getElementById('phattre')
        var phat = document.getElementById("phattien");
        if(cb.checked){
            $('#phattre span').text(plusMoney(soNgayTre*5000, $('#phattre span').text()))
        } else {
            $('#phattre span').text(minusMoney($('#phattre span').text(), 5000*soNgayTre))
        }
        trangThaiTra.classList.remove('hide-element')
        phat.classList.remove('hide-element')
    }
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
                    OpenModelTraSach(data.bookBorrow, hanTra, borrowTicketId, data.fine)
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
            if (checkTraSach.checked && !checkTraSach.disabled) {
                var data = {
                    id: row.querySelector("#bookId").value,
                    tinhtrang: row.querySelector(".lamhuhong").checked && !row.querySelector(".lamhuhong").disabled ? 'Hư hỏng/mất' : 'Đã trả'
                }
                sachtra.push(data)
            }
        });
        var tienPhatMuon = $('#phattre span').text()
        var tienPhatHuHong = $('#phathuhong span').text()
        var daPhat = $('#daPhat span').text()
        var data = {
            sachtra: JSON.stringify(sachtra),
            tienphat: plusMoney(plusMoney(tienPhatMuon, tienPhatHuHong),daPhat),
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
    $('.js-modal-da-tra-sach').each(function (i, obj) {
        $(this).click(function(){
            var borrowTicketId = $(this).attr('data-borrow-book-ticket-id')
            $.ajax({
                url: '/api/layChiTietPhieuTra',
                type: 'post',
                data: {
                    id: borrowTicketId
                },
                success: function (data) {
                    OpenModelDaTraSach(data)
                },
                error: function (err) {
                    console.error(err)
                }
            })
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
    console.log(oldMoney)
    console.log(parseInt(addedMoney))
    return parseInt(oldMoney) + parseInt(addedMoney)
}

function minusMoney(oldMoney, deductedMoney) {
    var result = parseInt(oldMoney) - parseInt(deductedMoney)
    if (result < 0) {
        return 0
    }
    return result
}

$(document).ready(function () {
    var dataTableMuonSach = $('#table-muon-sach').DataTable();
    $('#searchBoxMuonSach').keyup(function () {
        dataTableMuonSach.search(this.value).draw()
    })

    var dataTableTraSach = $('#table-tra-sach').DataTable();
    $('#searchBoxTraSach').keyup(function () {
        dataTableTraSach.search(this.value).draw()
    })

    var dataTableDaTraSach = $('#table-da-tra-sach').DataTable();
    $('#searchBoxDaTraSach').keyup(function () {
        dataTableDaTraSach.search(this.value).draw()
    })
});

function addDates(date, days){
    var result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}