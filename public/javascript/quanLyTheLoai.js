$(document).ready(
    $('.edit-category').each(function(i,obj){
        $(this).click(function(){
            var idTheLoai = $(this).attr('data-id-theloai')
            var tenTheLoai = $(this).attr('data-ten-theloai')
            $('.modal-body #tenLoai').val(tenTheLoai)
            $('.modal-body #idLoai').val(idTheLoai)
            $('.modal').modal('show');
        })
    })
)

$(document).ready(
    $('.delete-category').each(function(i,obj){
        $(this).click(function(){
            var idTheLoai = $(this).attr('data-id-theloai')
            if(confirm('Xác nhận xóa thể loại') == true){
                $.ajax({
                    url : '/quanLyTheLoai/delete',
                    dataType : 'json',
                    type : 'post',
                    data : {
                        id : idTheLoai
                    }, 
                    success : function(data){
                        alert("Xóa thành công")
                        window.location.replace("/quanLyTheLoai");
                    },
                    error : function(err){
                      console.log(err)
                    } 
                })
            }
        })
    })
)

function HienFormThemTheLoai(){
    document.getElementById('themtheloai').classList.remove('hide-element');
}