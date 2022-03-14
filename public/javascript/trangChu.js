$(document).ready(function(){
    $('.js-muon-sach').each(function(i,obj){
        $(this).click(function(){
            $.ajax({
                url:'/api/themSachVaoGio',
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
                    }else{
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