$(function(){
    $('#searchBox').autocomplete({
      source : function(req,res){
        $.ajax({
          url : '/trangChu/autocomplete',
          dataType : 'json',
          type : 'GET',
          data : {
              term : $('#searchBox').val(),
              kieuTim : $('#kieuTim option:selected').val()
          },
          success : function(data){
            res(data)
          },
          error : function(err){
            console.log(err)
          } 
        })
      },
      minLength : 1,
      select : function(event, ui){
        if(ui.item){
          $('#searchBox').text(ui.item.label)
        }
      }
    })
  })

  $(document).ready(function(){
    $('.js-muon-sach').each(function(i,obj){
        $(this).click(function(){
            $.ajax({
                url:'/gioSach/themSachVaoGio',
                type:'post',
                data: {
                    id: $(this).attr('data-id-book')
                },
                success: function(data, status){
                    if(data.message == "Thanh cong"){
                        $('#cartQuantity').text(data.cartQuantity)
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Thêm sách vào giỏ thành công!',
                        })
                    }else if(data.message == "That bai"){
                        Swal.fire({
                            icon: 'error',
                            title: 'Thất bại',
                            text: 'Sách này đã có trong giỏ',
                        })
                    }else if(data.message == "Gio da day"){
                        Swal.fire({
                            icon: 'warning',
                            title: 'Thất bại',
                            text: 'Giỏ sách của bạn đã đầy!',
                        })
                    }else if(data == "Ban khong co quyen"){
                      Swal.fire({
                          icon: 'error',
                          title: 'Thất bại',
                          text: 'Bạn không thể mượn sách với vai trò quản trị viên, kỹ thuật viên, hoặc thủ thư',
                      })
                    }
                    else{
                        window.location.replace('/dangNhap')
                    }
                },
                error : function(err){
                    console.error(err)
                }
            })
        })
    })
})

var page = 1

$('.js-load-more').click(function(){
    page++;
    getBooks(page)
})

function getBooks(page){
    let loadMoreBtn = document.getElementById('load-more-btn');
    let preText = loadMoreBtn.innerText;
    let url = loadMoreBtn.getAttribute("data-url");
    
    loadMoreBtn.innerText = 'Đang tải...';

    $.ajax({
        type: 'get',
        url: url+page,
        dataType: 'json',
        success: function(books){
            loadMoreBtn.innerText = preText
            if(books.length == 0){
                $('.js-load-more').fadeOut();
            }
            appendBooks(books)
        }
    })
}

function appendBooks(books){
  let html = ''
  $.each(books, function(index, book){
    html += '<div class="card-container col-sm-3">';
    html += '    <div class="card-base">';
    html += '        <a href="/chiTietSach/'+book.id+'">';
    html += '            <img class="img-fluid img-card"';
    html += '                src="'+book.coverImage+'"></a>';
    html += '        <button class="btn-base js-muon-sach"';
    html += '            data-id-book="'+book.id+'">Mượn sách</button>';
    html += '        <div class="text-content">';
    html += '            <div class="limit-text ten-sach"><i';
    html += '                    class="fa-solid fa-book"></i>';
    html +=                 book.bookName;
    html += '            </div>';
    html += '            <div class="limit-text tac-gia"><i class="fa-solid fa-user"></i>';
    html +=                 book.author;
    html += '            </div>';
    html += '         </div>';
    html += '    </div>';
    html += '</div>';

  })

  $('.js-display-books').append(html)
}