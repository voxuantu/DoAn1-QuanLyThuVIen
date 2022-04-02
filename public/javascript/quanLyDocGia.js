Validator({
    form : '#FormThemMoi',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#FormThemMoi #username'),
        Validator.isRequire('#FormThemMoi #password'),
        Validator.isRequire('#FormThemMoi #displayName'),
        Validator.isRequire('#FormThemMoi #address'),
        Validator.isRequire('#FormThemMoi #gender'),
        Validator.isRequire('#FormThemMoi #phone'),
        Validator.isRequire('#FormThemMoi #email'),
        Validator.isEmail('#FormThemMoi #email'),
        Validator.isRequire('#FormThemMoi #birth'),
    ]
});

