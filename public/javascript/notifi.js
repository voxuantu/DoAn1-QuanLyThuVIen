    var down = false;
    
    function toggleNotify(){
        if(down){
            document.getElementById('notifi-box-id').classList.remove("display-notifi-box");
            down=false;
        }else{
            document.getElementById('notifi-box-id').classList.add("display-notifi-box");
            down=true;
        }
    }