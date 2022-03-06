function OpenModal() {
    $(document).ready(
        function () {
            $('.modalMuonSach').modal('show');
        }
    )
}

function OpenModelTraSach(){
    $(document).ready(
        function () {
            $('.modalTraSach').modal('show');
        }
    )
}

function OpenModelDaTraSach(){
    $(document).ready(
        function () {
            $('.modalDaTraSach').modal('show');
        }
    )
}

var checkHuHong = false;

function showPhatHuHong(){
    $(document).ready(
        function () {
            $('.modalTraSach tbody input.lamhuhong').each(function(i,obj){
                if(checkHuHong == false){
                    if($(this).is(':checked')){
                        var phathuhong = document.getElementById("phathuhong");
                        phathuhong.classList.remove("hide-element");
                        checkHuHong = true;
                    }
                }
            })
            var atLeastOneIsChecked = $('input[name="lamhuhong"]:checked').length > 0;
            if(checkHuHong == true && atLeastOneIsChecked == false){
                var phathuhong = document.getElementById("phathuhong");
                phathuhong.classList.add("hide-element");
                checkHuHong = false
            }
        }
    )
}

var checkAll = false;

function CheckAllBook(){
    $(document).ready(
        function () {
            if(checkAll){
                $('.modalTraSach tbody input.checksachtra').each(function(i,obj){
                    $(this).prop('checked', false);
                })
                checkAll = false;
            }else{
                $('.modalTraSach tbody input.checksachtra').each(function(i,obj){
                    $(this).prop('checked', true);
                })
                checkAll = true;
            }
        }
    )
}