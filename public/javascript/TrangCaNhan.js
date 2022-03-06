var down = false;

function toggleEdit() {

    if (down) {
        document.getElementById('nuteditThongTin').classList.remove("display-edit-button");

        $(document).ready(function () {
            $(".thongtincanhan label.tieude").each(function (i, obj) {
                obj.classList.remove('hide-element')
            })
        })
        $(document).ready(function () {
            $(".thongtincanhan input.form-control").each(function (i, obj) {
                obj.classList.add('hide-element')
            })
        })
        down = false;
    } else {
        document.getElementById('nuteditThongTin').classList.add("display-edit-button");

        $(document).ready(function () {
            $(".thongtincanhan label.tieude").each(function (i, obj) {
                obj.classList.add('hide-element')
            })
        })
        $(document).ready(function () {
            $(".thongtincanhan input.form-control").each(function (i, obj) {
                obj.classList.remove('hide-element')
            })
        })

        down = true;
    }
}
function OpenModal(mamuonsach, matrangthai) {
    $(document).ready(
        function () {
            if(matrangthai != 2){

                $('.modal-chi-tiet-muon-sach .nutbam').addClass('hide-element');
            } else {
                $('.modal-chi-tiet-muon-sach .nutbam').removeClass('hide-element');
            }
            $('.modal-chi-tiet-muon-sach').modal('show');
        }
    )
}
function OpenModalChangePass() {
    $(document).ready(
        function () {
            $('.modal-change-password').modal('show');
        }
    )
}
function OpenModalTraSach() {
    $(document).ready(
        function () {
            $('.modal-tra-sach').modal('show');
        }
    )
}