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
                    document.getElementById('section2').style.visibility = 'visible';
                }

            })
    }

})

/**
 * Part 3
 */

//getting food objects and populating menu 


fetch('food.json').then(response => response.json()).then(data => {
    var startersfoodContainer = document.getElementsByClassName('starters')[0];
    var mainsfoodContainer = document.getElementsByClassName('mains')[0];
    var dessertsfoodContainer = document.getElementsByClassName('desserts')[0];
    var drinksfoodContainer = document.getElementsByClassName('drinks')[0];

    data.starters.forEach(element => {
        startersfoodContainer.innerHTML += `<div data-name="${element.name}" data-price="${element.price}" data-type="starters" class="menu-item form-group"><strong>${element.name}</strong>  <span class="cart-btn btn btn-secondary">+</span></div>`
    })
    data.mains.forEach(element => {
        mainsfoodContainer.innerHTML += `<div data-name="${element.name}" data-price="${element.price}" data-type="mains" class="menu-item form-group"><strong>${element.name}</strong>  <span class="cart-btn btn btn-secondary">+</span></div>`
    })
    data.desserts.forEach(element => {
        dessertsfoodContainer.innerHTML += `<div data-name="${element.name}" data-price="${element.price}" data-type="desserts" class="menu-item form-group"><strong>${element.name}</strong>  <span class="cart-btn btn btn-secondary">+</span></div>`
    })
    data.drinks.forEach(element => {
        drinksfoodContainer.innerHTML += `<div data-name="${element.name}" data-price="${element.price}" data-type="drinks" class="menu-item form-group"><strong>${element.name}</strong>  <span class="cart-btn btn btn-secondary">+</span></div>`
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
    if (preventMultiple(name) == name) {
        increaseQuantity(name);
    } else {
        var cart = document.getElementById('cart');
        cart.innerHTML += `<div class="cart-item mt-2 mb-4">
    <span class="cart-name">${name}</span>    
    <input class="cart-quantity" placeholder="0" type="number" min="0" max="5">
    <span class="cart-price">${price} /pc</span>
    </div>`
    }
}

function increaseQuantity(name) {
    var cartitems = document.getElementsByClassName('cart-item')
    for (var i = 0; i < cartitems.length; i++) {
        var cartName = cartitems[i].getElementsByClassName('cart-name')[0].innerText;;
        if (cartName == name) {
            if (cartitems[i].getElementsByClassName('cart-quantity')[0].value < 5) {
                cartitems[i].getElementsByClassName('cart-quantity')[0].value++;
            }
        }

    }
}

function updatePrice() {
    var cartitems = document.getElementsByClassName('cart-item')
    total = 0;
    for (var i = 0; i < cartitems.length; i++) {
        var price = cartitems[i].getElementsByClassName('cart-price')[0].innerText;
        price.replace(' /pc', '');
        var quantity = cartitems[i].getElementsByClassName('cart-quantity')[0].value;
        total = total + (parseFloat(price) * quantity)
        total = Math.round(total)
    }
    document.getElementsByClassName('cart-total')[0].innerHTML = `Total: € ${total} `;
}

function preventMultiple(name) {
    var cartItems = document.getElementsByClassName('cart-item')
    for (var i = 0; i < cartItems.length; i++) {
        var cartName = cartItems[i].getElementsByClassName('cart-name')[0].innerText;
        if (cartName == name) {
            return cartName;
        }
    }

}