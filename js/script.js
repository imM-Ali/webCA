var errorEle = document.getElementById('error');
var password = document.getElementById('pass');
var form = document.getElementById('myForm');

form.addEventListener('submit', function (e) {
    var failed, message;

    if (password.value == null || password.value == "") {
        message = "Password cannot be blank!";
        failed = true;
    }
    else if (password.value.length < 8) {
        message = "Cannot be shorter than 8 characters";
        failed = true;
    }
    else if (!password.value.match(/^(?=.*\d)(?=.*[a-zA-Z]+)(?=.*[\!\"\£\$\%\^\&\*\(\)]+).{8,}$/)) {
        message = "Atleast 1 Lowercase, 1 Uppercase, 1 digit and 1 Special character";
        failed = true;
    }


    if (failed) {
        e.preventDefault();
        errorEle.innerHTML = message;
        errorEle.style.visibility = 'visible';
    }

})
