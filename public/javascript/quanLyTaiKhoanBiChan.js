$(document).ready(function(){
    var dataTable = $('#table-doc-gia-bi-chan').DataTable();
    $('#searchBox').keyup(function(){
        dataTable.search(this.value).draw()
    })
})

$(document).ready(
    $('.js-unblock-user').each(function(i,obj){
        $(this).click(function(){
            var id = $(this).attr('data-user-id')

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: true
            })

            swalWithBootstrapButtons.fire({
                title: 'Bạn có muốn bỏ chặn người dùng này không?',
                text: "Tài khoản này sẽ hoạt động bình thường sau khi bỏ chặn",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Có',
                cancelButtonText: 'Không',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url: '/quanLyDocGia/boChanDocGia',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: id
                        },
                        success: function (data) {
                            window.location.replace(data);
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                }
            })
        })
    })
);