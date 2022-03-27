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
