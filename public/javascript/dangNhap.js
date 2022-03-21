Validator({
    form : '#formDangNhap',
    formGroupSelector : '.mb-3',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#username'),
        Validator.isRequire('#password')
    ]
});