$(document).ready(
    $('.edit-publisher').each(function(i,obj){
        $(this).click(function(){
            var idNbx = $(this).attr('data-id-nbx')
            var tenNbx = $(this).attr('data-ten-nbx')
            $('.modal-body #tenNbx').val(tenNbx)
            $('.modal-body #idNbx').val(idNbx)
            $('.modal').modal('show');
        })
    })
)

$(document).ready(
    $('.delete-publisher').each(function(i,obj){
        $(this).click(function(){
            var idNbx = $(this).attr('data-id-nbx')
            if(confirm('Xác nhận xóa nhà xuất bản') == true){
                $.ajax({
                    url : '/quanLyNhaXuatBan/delete',
                    dataType : 'json',
                    type : 'post',
                    data : {
                        id : idNbx
                    }, 
                    success : function(data){
                        alert("Xóa thành công")
                        window.location.replace("/quanLyNhaXuatBan");
                    },
                    error : function(err){
                      console.log(err)
                    } 
                })
            }
        })
    })
)

function HienFormThemNBX(){
    document.getElementById('themNBX').classList.remove('hide-element');
}