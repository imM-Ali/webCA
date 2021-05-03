/*PART 1*/

var errorEle = document.getElementById('error');
var password = document.getElementById('pass');
var nxtBtn = document.getElementById('mybtn');
var errMsg;

//checks the password and sets the error message value accordingly, if no error, then message is empty  
function check() {
    errMsg = "";
    if (password.value == null || password.value == "") {
        errMsg = "Password cannot be blank!";

    } else if (password.value.length < 8) {
        errMsg = "Cannot be shorter than 8 characters";

    } else if (!password.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)) {
        errMsg = "Atleast 1 Lowercase, 1 Uppercase, 1 digit and 1 Special character";

    }
}
//calls to check password after every keystroke and displays message and styling
password.addEventListener('keyup', function() {
    check();
    errorEle.innerHTML = errMsg;
    errorEle.style.visibility = 'visible';
    if (errMsg != "") {
        document.querySelector('input').style.borderBottom = '1px solid red';
        nxtBtn.style.display = 'none';
    } else {
        document.querySelector('input').style.borderBottom = '1px solid lightgreen';
        nxtBtn.style.display = 'inline-block';
        nxtBtn.focus();

    }

});
//prevents form submission if there is an error message

nxtBtn.addEventListener('click', (e) => {
        if (errMsg != "") {
            e.preventDefault();
        } else {
            document.querySelector('.nav-link').innerHTML = "Customers"
            fetch('https://randomuser.me/api/?results=5&inc=name,picture,email')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('content').innerHTML = "";
                    for (let i = 0; i < 5; i++) {
                        var customer = " <div id='user_" + (i + 1) + "' class='col-lg-6 col-md-12' style='text-align: -webkit-center;'>" +
                            "<div class='card mb-5 shadow rounded' style='width: 20rem;''>" +
                            "<img class='card-img-top' style='width:60%; align-self: center; margin-top:5px' src='" + data.results[i].picture.large + "'>" +
                            "<div class='card-body'><h5 class='card-title'>" + data.results[i].name.first + " " + data.results[i].name.last + "</h5></div>" +
                            "<ul class='list-group list-group-flush'><li class='list-group-item'>" + data.results[i].email + "</li></ul>" +
                            "</div></div>"
                        document.getElementById('content').innerHTML += customer;

                    }

                    //!!!!!!!!!!!!!!!!!!!!   FORM SECTION    !!!!!!!!!!!!!!!!!!!!!!!

                }).then(() => {

                    document.querySelector('.formSection').removeAttribute("hidden");
                    document.getElementById('scrollToMe').scrollIntoView();

                    //populating drop down menus
                    for (let i = 0; i < Starters.length; i++) {
                        document.getElementById('starters').innerHTML += "<option value='" + JSON.stringify(Starters[i]) + "'>" + Starters[i].name + "</option>"
                        document.getElementById('mains').innerHTML += "<option value='" + JSON.stringify(Mains[i]) + "'>" + Mains[i].name + "</option>"
                        document.getElementById('drinks').innerHTML += "<option value='" + JSON.stringify(Drinks[i]) + "'>" + Drinks[i].name + "</option>"
                    }
                })

        }

    })
    //creating food objects 
var Starters = [{
        "name": "Onion Bhaji",
        "description": "Onions",
        "isVeg": true,
        "price": 3.99
    },
    {
        "name": "Chicken Wings",
        "description": "Chicks",
        "isVeg": false,
        "price": 2.99
    },
    {
        "name": "Curry soup",
        "description": "Soup",
        "isVeg": true,
        "price": 4.25
    }
]
var Drinks = [{
        "name": "Sprite",
        "description": "Clear",
        "price": 1.99
    },
    {
        "name": "Coke",
        "description": "Cola",
        "price": 2.99
    },
    {
        "name": "Fanta",
        "description": "Funky",
        "price": 1.25
    }
]
var Mains = [{
            "name": "Lamb Biryani",
            "description": "rice",
            "isVeg": false,
            "price": 5.99
        },
        {
            "name": "Mustard Stuffed Chicken",
            "description": "chick",
            "isVeg": false,
            "price": 7.99
        },
        {
            "name": "Veg Lasagne",
            "description": "veggies",
            "isVeg": true,
            "price": 3.99
        }

    ]
    //declaring selected items, will set value later
var selectedStarterPrice, selectedMainPrice, selectedDrinkPrice, TotalPrice;
document.querySelector('form').addEventListener('submit', (e) => {
    //prevents form submission
    e.preventDefault();
    document.querySelector('.total').removeAttribute("hidden");
    //handles if one dropdown is not changed from default value
    TotalPrice = nanHandler(selectedStarterPrice, selectedMainPrice, selectedDrinkPrice);
    document.querySelector('.total').innerHTML = "<strong>Total: </strong>" + TotalPrice + "";
    document.querySelector('#breakDown').removeAttribute("hidden");
});

function nanHandler(a, b, c) {
    if (isNaN(a)) {
        a = 0;
    }
    if (isNaN(b)) {
        b = 0;
    }
    if (isNaN(c)) {
        c = 0;
    }
    return a + b + c;
}

document.getElementById('starters').addEventListener('change', event => {

    var obj = JSON.parse(event.target.value);
    selectedStarterPrice = obj.price;
    if (obj.isVeg) {
        document.getElementById('sNature').innerHTML = " -veg- ";
    } else {
        document.getElementById('sNature').innerHTML = "";
    }
    tableWriter(obj, "row_1");

})
document.getElementById('mains').addEventListener('change', event => {

    var obj = JSON.parse(event.target.value);
    selectedMainPrice = obj.price;
    if (obj.isVeg) {
        document.getElementById('mNature').innerHTML = " -veg- ";
    } else {
        document.getElementById('mNature').innerHTML = "";
    }
    tableWriter(obj, "row_2");
})

document.getElementById('drinks').addEventListener('change', event => {

    var obj = JSON.parse(event.target.value);
    selectedDrinkPrice = obj.price;
    tableWriter(obj, "row_3");

})


function tableWriter(obj, start = "") {

    document.getElementById("" + start + "").innerHTML = "";
    switch (start) {
        case "row_1":
            document.getElementById("" + start + "").innerHTML += "<th scope='row'>Starter</th><td>" + obj.name + "</td><td>" + obj.price + "</td>";
            break;
        case "row_2":
            document.getElementById("" + start + "").innerHTML += "<th scope='row'>Main</th><td>" + obj.name + "</td><td>" + obj.price + "</td>";
            break;
        case "row_3":
            document.getElementById("" + start + "").innerHTML += "<th scope='row'>Drink</th><td>" + obj.name + "</td><td>" + obj.price + "</td>";
            break;
    }





}