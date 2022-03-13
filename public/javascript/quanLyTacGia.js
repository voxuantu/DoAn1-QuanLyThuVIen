$(document).ready(
    $('.edit-author').each(function(i,obj){
        $(this).click(function(){
            var idTacGia = $(this).attr('data-id-tacgia')
            var tenTacGia = $(this).attr('data-ten-tacgia')
            $('.modal-body #tenTacGia').val(tenTacGia)
            $('.modal-body #idTacGia').val(idTacGia)
            $('.modal').modal('show');
        })
    })
)

$(document).ready(
    $('.delete-author').each(function(i,obj){
        $(this).click(function(){
            var idTacGia = $(this).attr('data-id-tacgia')
            if(confirm('Xác nhận xóa tác giả') == true){
                $.ajax({
                    url : '/quanLyTacGia/delete',
                    dataType : 'json',
                    type : 'post',
                    data : {
                        id : idTacGia
                    }, 
                    success : function(data){
                        alert("Xóa thành công")
                        window.location.replace("/quanLyTacGia");
                    },
                    error : function(err){
                      console.log(err)
                    } 
                })
            }
        })
    })
)

function HienFormThemTacGia(){
    document.getElementById('themtheloai').classList.remove('hide-element');
}