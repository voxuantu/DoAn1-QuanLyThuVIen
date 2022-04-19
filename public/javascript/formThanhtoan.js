Validator({
    form : '#form-thanh-toan',
    formGroupSelector : '.form-group',
    errorSelector : '.errorMessage',
    rules : [
        Validator.isRequire('#form-thanh-toan #orderType'),
        Validator.isRequire('#form-thanh-toan #amount'),
        Validator.isRequire('#form-thanh-toan #orderDescription'),
        Validator.isRequire('#form-thanh-toan #bankCode'),
        Validator.isRequire('#form-thanh-toan #language')
    ]
});