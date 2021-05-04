/**
 * Part 1
 */

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
/**
 * Part 2
 */

nxtBtn.addEventListener('click', (e) => {
    if (errMsg != "") {
        e.preventDefault();
    } else {
        document.querySelector('.nav-link').innerHTML = "Customers";
        fetch('https://randomuser.me/api/?results=5&inc=name,picture,email')
            .then(response => response.json())
            .then(data => {
                document.getElementById('section1').innerHTML = "";
                for (let i = 0; i < 5; i++) {
                    var customer = " <div id='user_" + (i + 1) + "' class='col-lg-6 col-md-12' style='text-align: -webkit-center;'>" +
                        "<div class='card mb-5 shadow rounded' style='width: 20rem;''>" +
                        "<img class='card-img-top' style='width:60%; align-self: center; margin-top:5px' src='" + data.results[i].picture.large + "'>" +
                        "<div class='card-body'><h5 class='card-title'>" + data.results[i].name.first + " " + data.results[i].name.last + "</h5></div>" +
                        "<ul class='list-group list-group-flush'><li class='list-group-item'>" + data.results[i].email + "</li></ul>" +
                        "</div></div>"
                    document.getElementById('section1').innerHTML += customer;

                }

            })
    }

})

/**
 * Part 3
 */

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
var Desserts = [{
        "name": "Kheer",
        "description": "rice",
        "isVeg": false,
        "price": 5.99
    },
    {
        "name": "Firni",
        "description": "chick",
        "isVeg": false,
        "price": 7.99
    },
    {
        "name": "Or nahi pta",
        "description": "veggies",
        "isVeg": true,
        "price": 3.99
    }
]

fetch('food.json').then(response => response.json()).then(data => {
    var startersfoodContainer = document.getElementsByClassName('starters')[0];
    var mainsfoodContainer = document.getElementsByClassName('mains')[0];
    data.starters.forEach(element => {
        startersfoodContainer.innerHTML += `<div data-name="${element.name}" data-price="${element.price}" data-type="starters" class="menu-item form-group"><strong>${element.name}</strong>  <span class="cart-btn btn btn-secondary">+</span></div>`
    })
    data.mains.forEach(element => {
        mainsfoodContainer.innerHTML += `<div data-name="${element.name}" data-price="${element.price}" data-type="mains" class="menu-item form-group"><strong>${element.name}</strong>  <span class="cart-btn btn btn-secondary">+</span></div>`
    })

}).then(() => {
    document.querySelectorAll('.cart-btn').forEach(item => {
        item.addEventListener('click', (e) => {
            var itemName = e.target.parentElement.dataset.name;
            var itemPrice = e.target.parentElement.dataset.price;
            var itemType = e.target.parentElement.dataset.type;
            addToCart(itemName, itemPrice, itemType);
        })
    })
})

document.getElementById('invokeBtn').addEventListener('click', () => {
    updatePrice();
})

function addToCart(name, price) {
    var cart = document.getElementById('cart');
    cart.innerHTML += `<div class="cart-item">${name} :
    <span class="cart-price">${price}</span>
    <input class="cart-quantity" type="number" min="0" max="5">
</div>`
}

function updatePrice() {
    var cartitems = document.getElementsByClassName('cart-item')
    total = 0;
    for (var i = 0; i < cartitems.length; i++) {
        var cartItem = cartitems[i];
        var price = cartItem.getElementsByClassName('cart-price')[0].innerText;
        var quantity = cartItem.getElementsByClassName('cart-quantity')[0].value;
        total = total + (parseFloat(price) * quantity)
    }
    document.getElementsByClassName('cart-total')[0].innerHTML = total;
}