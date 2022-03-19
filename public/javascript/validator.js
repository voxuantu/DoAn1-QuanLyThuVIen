function Validator(options) {

    var selectorRules = {}

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage

        var rules = selectorRules[rule.selector]

        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value)
            if (errorMessage) {
                break;
            }
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }

        return !errorMessage;
    }

    var formElement = document.querySelector(options.form)
    if (formElement) {
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormvalid = true;

            options.rules.forEach(rule => {
                var inputElement = formElement.querySelector(rule.selector)
                var isValid = validate(inputElement, rule)
                if(!isValid){
                    isFormvalid = false;
                }
            })

            if(isFormvalid){
                if(typeof options.onSubmit == 'function'){
                    var enableInput = formElement.querySelectorAll('[name]')

                    var formValue = Array.from(enableInput).reduce(function(value, input){
                        return (value[input.name] = input.value) && value
                    },{});

                    options.onSubmit(formValue)
                } else {
                    formElement.submit();
                }
            }
        }

        options.rules.forEach(rule => {

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)

            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }
}

Validator.isRequire = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}

Validator.isConfirmed = function (selector, getConfrimValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfrimValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}