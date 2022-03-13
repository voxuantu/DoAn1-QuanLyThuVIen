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