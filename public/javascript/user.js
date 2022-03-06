var show = false;

function toggleUserBox(){
    var userbox = document.getElementById("userBox");
    if(show){
        userbox.classList.add("hide-element");
        show = false;
    }else{
        userbox.classList.remove("hide-element");
        show = true;
    }
}