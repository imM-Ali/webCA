var errorEle = document.getElementById('error');
var password = document.getElementById('pass');
var form = document.getElementById('myForm');
var errMsg;

//checks the password and sets the error message value accordingly, if no error, then message is empty  
function check() {
    errMsg = "";
    if (password.value == null || password.value == "") {
        errMsg = "Password cannot be blank!";

    }
    else if (password.value.length < 8) {
        errMsg = "Cannot be shorter than 8 characters";

    }
    else if (!password.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)) {
        errMsg = "Atleast 1 Lowercase, 1 Uppercase, 1 digit and 1 Special character";

    }
}
//calls to check password after every keystroke and displays message and styling
password.addEventListener('keyup', function () {
    check();
    errorEle.innerHTML = errMsg;
    errorEle.style.visibility = 'visible';
    if (errMsg != "") {
        document.querySelector('input').style.borderBottom = '1px solid red';
        document.getElementById('mybtn').style.display = 'none';
    } else {
        document.querySelector('input').style.borderBottom = '1px solid lightgreen';
        document.getElementById('mybtn').style.display = 'inline-block';
    }

});
//prevents form submission if there is an error message
form.addEventListener('submit', (e) => {
    if (errMsg != "") {
        e.preventDefault();
    }
})
