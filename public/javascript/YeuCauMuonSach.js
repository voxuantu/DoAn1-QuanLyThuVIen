function OpenModal(bookBorrow) {
    $(document).ready(
        function () {
            $(".modalMuonSach tbody tr").remove()
            for (let i = 0; i < bookBorrow.length; i++) {
                const book = bookBorrow[i].bookId;
                markup = `<tr><td scope="row">${i+1}</td><td><img src="${book.coverImage}" alt="${book.name}" class="img-fluid"></td><td>${book.name}</td></tr>`
                $('.modalMuonSach tbody').append(markup)
            }
            $('.modalMuonSach').modal('show');
        }
    )
}

function OpenModelTraSach(){
    $(document).ready(
        function () {
            $('.modalTraSach').modal('show');
        }
    )
}

function OpenModelDaTraSach(){
    $(document).ready(
        function () {
            $('.modalDaTraSach').modal('show');
        }
    )
}

var checkHuHong = false;

function showPhatHuHong(){
    $(document).ready(
        function () {
            $('.modalTraSach tbody input.lamhuhong').each(function(i,obj){
                if(checkHuHong == false){
                    if($(this).is(':checked')){
                        var phathuhong = document.getElementById("phathuhong");
                        phathuhong.classList.remove("hide-element");
                        checkHuHong = true;
                    }
                }
            })
            var atLeastOneIsChecked = $('input[name="lamhuhong"]:checked').length > 0;
            if(checkHuHong == true && atLeastOneIsChecked == false){
                var phathuhong = document.getElementById("phathuhong");
                phathuhong.classList.add("hide-element");
                checkHuHong = false
            }
        }
    )
}

var checkAll = false;

function CheckAllBook(){
    $(document).ready(
        function () {
            if(checkAll){
                $('.modalTraSach tbody input.checksachtra').each(function(i,obj){
                    $(this).prop('checked', false);
                })
                checkAll = false;
            }else{
                $('.modalTraSach tbody input.checksachtra').each(function(i,obj){
                    $(this).prop('checked', true);
                })
                checkAll = true;
            }
        }
    )
}

$(document).ready(function(){
    $('.js-modal-muon-sach').each(function(i,obj){
        $(this).click(function(){
            $.ajax({
                url:'/api/layChiTietPhieuMuon',
                type:'post',
                data: {
                    id: $(this).attr('data-book-borrowed')
                },
                success: function(data){
                    OpenModal(data.bookBorrow)
                },
                error : function(err){
                    console.error(err)
                }
            })
        })
    })
})