var isLichPhucVu = false;
var isNoiQuy = false;

function displayArea(id){
    var lichPhucVu = document.getElementById("LichPhucVu");
    var noiQuyThuVien = document.getElementById("NoiQuyThuVien");
    var gioiThieu = document.getElementById("GioiThieuThuVien");
    gioiThieu.classList.add("hide-element");

    if(id == 1){
        lichPhucVu.classList.remove("hide-element");
        isLichPhucVu  = true;
        if(isNoiQuy){
            noiQuyThuVien.classList.add("hide-element");
        }
    }else{
        noiQuyThuVien.classList.remove("hide-element");
        isNoiQuy = true;
        if(isLichPhucVu){
            lichPhucVu.classList.add("hide-element");
        }
    }
}