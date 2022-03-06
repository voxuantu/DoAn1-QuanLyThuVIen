function SuaSach() {
    $(document).ready(function () {
        $('.title_themmoi').text("Chỉnh sửa sách");
    });
}
function HienFormThemSachs(){
    $(document).ready(function () {
        $('.title_themmoi').text("Thêm sách mới");
        $('#tensach').val("");
        $('#tacgia').val("");
        $('#soluong').val("");
        $('#mota').val("");
        $('select #default').prop('selected', true);
    });
}
function displayArea(id){
    if(id == 1){
        document.getElementById('ql-sach').classList.remove('hide-element');
        document.getElementById('ql-theloai').classList.add('hide-element');
    } else if(id == 2){
        document.getElementById('ql-sach').classList.add('hide-element');
        document.getElementById('ql-theloai').classList.remove('hide-element');
    }
}
function HienFormSuaTheLoai(){
    document.getElementById('themtheloai').classList.remove('hide-element');
}
function OpenEditTheLoaiModal() {
    $(document).ready(
        function () {
            $('.modal').modal('show');
        }
    )
}