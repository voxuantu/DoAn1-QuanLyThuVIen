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
    html += '           <form action="/gioSach/themSachVaoGio" method="post">';
    html += '              <input type="text" name="id" value="'+book.id+'" hidden>';
    html += '              <button class="btn-base js-muon-sach">Mượn sách</button>';
    html += '           </form>';
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
