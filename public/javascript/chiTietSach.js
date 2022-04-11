var page = 1
$(document).ready(function(){
    let button = document.getElementById('btn-xem-binh-luan')
    let bookId = button.getAttribute('data-bookId')
    
    $('.js-xem-binh-luan').click(function(){
        page++;
        $.ajax({
            url: '/api/layBinhLuan?bookId='+bookId+'&page='+page,
            type:'get',
            success: function(comments){
                if(comments.length == 0){
                    $('.js-xem-binh-luan').fadeOut();
                }
                appendComments(comments)
            }
        })
    })
})

function appendComments(comments){
    let html = ''
    $.each(comments, function(index, comment){
        let starRating = '<div class="mb-2">';
        for (let i = 0; i < 5; i++) {
            if(i < comment.starRating){
                starRating += '<i class=\'fa fa-star yellowstar\'></i>'
            }else{
                starRating += '<i class=\'fa fa-star-o\'></i>'
            }
            
        }
        starRating += '</div>';
        html += '<li>';
        html += '    <div class="row" >';
        html += '        <div class="col-sm-1" style="text-align: center;">';
        html += '            <img class="img-fluid" style="border-radius: 50%;" src="'+comment.reader.img+'" alt="">';
        html += '        </div>';
        html += '        <div class="col-sm-11">';
        html += '            <div style="display: flex; justify-content: space-between;">';
        html += '                <span style="font-weight: 500;">'+comment.reader.displayName+'</span>';
        html += '                <span>'+ moment(comment.dateComment).format("D/M/YYYY")+'</span>';
        html += '            </div>';
        html +=              starRating;
        html += '            <p style="background-color: #e8f0fe; border-radius: 5px; padding: 5px;">';
        html +=                     comment.content;
        html += '            </p>';
        html += '        </div>';
        html += '    </div>';
        html += '</li>';
    })
    $('.js-binh-luan').append(html)
}