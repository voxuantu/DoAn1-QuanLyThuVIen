const params = new URLSearchParams(window.location.search)
if(params.get('text')){
    Swal.fire({
        icon: params.get('type'),
        title: params.get('title'),
        text: params.get('text'),
    })
}