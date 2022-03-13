function OpenImgDialog(){
    $(document).ready(function(){
        $('#imgUpload').trigger('click');
    })
}

function ShowImage(event){
    var image = document.getElementById('anhBia');
	image.src = URL.createObjectURL(event.target.files[0]);
}

$(document).ready(function(){
    $('.delete-book').each(function(j,obj){
        $(this).click(function(){
            if(confirm('Xác nhận xóa sách') == true){
                var id = $(this).attr('data-id-book')
                $.ajax({
                    url : '/quanLySach/delete',
                    dataType : 'json',
                    type : 'post',
                    data : {
                        id : id
                    }, 
                    success : function(data){
                        alert("Xóa thành công")
                        window.location.replace("/quanLySach/1");
                    },
                    error : function(err){
                        console.log(err)
                    } 
                })
            }
        })
    })
})