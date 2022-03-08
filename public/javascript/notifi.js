    var down = false;
    
    function toggleNotify(){
        if(down){
            document.getElementById('notifi-box-id').classList.remove("hide-element");
            down=false;
        }else{
            document.getElementById('notifi-box-id').classList.add("hide-element");
            down=true;
        }
    }