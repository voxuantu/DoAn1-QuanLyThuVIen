function SuaNguoiDung() {
    $(document).ready(function () {
        $('.title_themmoi').text("Chỉnh sửa người dùng");
        $('#loaitaikhoan').attr('disabled', true);
        $('#tennd').attr('disabled', true);
        $('#namsinh').attr('disabled', true);
    });
}
function ThemNguoiDung(){
    $(document).ready(function () {
        $('#loaitaikhoan').prop('disabled', false);
        $('#tennd').prop('disabled', false);
        $('#namsinh').prop('disabled', false);
        $('.title_themmoi').text("Thêm người dùng");
        $('#tennd').val("");
        $('#namsinh').val("");
        $('#sodienthoai').val("");
        $('#email').val("");
        $('#tennd').val("");
        $('#diachi').val("");
    });
}