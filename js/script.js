/**
 * Part 1
 */

var errorEle = document.getElementById('error');
var password = document.getElementById('pass');
var nxtBtn = document.getElementById('mybtn');
var errMsg;

/**
 * checks the password and sets the error message value accordingly, if no error, then message is empty
 */
function passwordCheck() {
    errMsg = "";
    if (password.value == null || password.value == "") {
        errMsg = "Password cannot be blank!";

    } else if (password.value.length < 8) {
        errMsg = "Cannot be shorter than 8 characters";

    } else if (!password.value.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/)) {
        errMsg = "Atleast 1 Lowercase, 1 Uppercase, 1 digit and 1 Special character";

    }
}

/**
 * calls to check password after every keystroke and displays message and styling
 */
password.addEventListener('keyup', function() {
    passwordCheck();
    errorEle.innerHTML = errMsg;
    errorEle.style.visibility = 'visible';
    if (errMsg != "") {
        document.querySelector('input').style.borderBottom = '1px solid red';
        nxtBtn.style.visibility = 'hidden';
    } else {
        document.querySelector('input').style.borderBottom = '1px solid lightgreen';
        nxtBtn.style.visibility = 'visible';
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
        // document.querySelector('.nav-link').innerHTML = "Customers";
        fetch('https://randomuser.me/api/?results=5&inc=name,picture,email').then(response => response.json()).then(data => {
            document.getElementById('section1').style.display = 'none';
            //creates a bootstrap cart for each customer to load into
            for (let i = 0; i < 5; i++) {
                var customer = "<div id='user_" + (i + 1) + "' class='col-lg-3 col-md-4 user-card'>" +
                    "<div class='card mb-5 shadow rounded'>" +
                    "<img class='card-img-top' src='" + data.results[i].picture.large + "'>" +
                    "<div class='card-body p-2'><h5 class='card-title'>" + data.results[i].name.first + " " + data.results[i].name.last + "</h5>" +
                    "<p>" + data.results[i].email + "</p></div>"
                document.getElementById('section2').innerHTML += customer;
                document.getElementById('section2').style.display = 'flex';
                document.getElementById('section3').style.display = 'block';
            }
        })
    }
})

/**
 * Part 3
 */

//*food items are stored on an external server in a json file (because local json cannot be loaded without live server*

//getting food objects and populating menu 
fetch('https://api.jsonbin.io/b/609286acd64cd16802ab0af6/4').then(response => response.json()).then(data => {
    var startersfoodContainer = document.getElementsByClassName('starters')[0];
    var mainsfoodContainer = document.getElementsByClassName('mains')[0];
    var dessertsfoodContainer = document.getElementsByClassName('desserts')[0];
    var drinksfoodContainer = document.getElementsByClassName('drinks')[0];

    //creating a new div for each food item and appending to html
    function populate(element, foodContainer) {
        //populating menu
        foodContainer.innerHTML += `
        <div data-name="${element.name}" class="menu-item form-group">
        <strong>${element.name}</strong><br /> - 
        <span style="font-size:0.6em">
         <strong>${element.description}</strong>
         <span>   
         <span class="remove-btn btn btn-secondary">-
         </span>  
         <span class="add-to-cart-btn btn btn-secondary">+
         </span>
         </div>`;
        //populating cart - hidden on initital state
        var cart = document.getElementById('cart');
        cart.innerHTML += `<div data-type="${foodContainer.classList[0]}" class="cart-item mt-2 mb-4 d-none">
        <span class="cart-name">${element.name}</span>    
        <input class="cart-quantity" placeholder="0" type="number" min="0" max="5" readOnly>
        <span class="cart-price">${element.price} /pc</span>
        </div>`
    }

    data.starters.forEach(element => {
        populate(element, startersfoodContainer);
    })
    data.mains.forEach(element => {
        populate(element, mainsfoodContainer);
    })
    data.desserts.forEach(element => {
        populate(element, dessertsfoodContainer);
    })
    data.drinks.forEach(element => {
        populate(element, drinksfoodContainer);
    })

}).then(() => {
    document.querySelectorAll('.add-to-cart-btn').forEach(item => {
        item.addEventListener('click', (event) => {
            var parentElement = event.target.parentElement.parentElement.parentElement;
            cartHandler(parentElement.dataset.name);
        })
    });
    document.querySelectorAll('.remove-btn').forEach(item => {
        item.addEventListener('click', (event) => {
            var parentElement = event.target.parentElement.parentElement.parentElement;
            cartHandler(parentElement.dataset.name, "remove");
        })
    });
})

document.getElementById('totalBtn').addEventListener('click', updatePrice)

/**
 * unhides the clicked product in cart
 */
function cartHandler(name, action = "add") {
    var cartItems = document.getElementsByClassName('cart-item')
    for (var i = 0; i < cartItems.length; i++) {
        var cartItemName = cartItems[i].getElementsByClassName('cart-name')[0].innerText;
        if (cartItemName == name) {
            //unhides the passed element in the cart
            cartItems[i].classList.remove('d-none')
                //increases cart item quantity by 1
            var currentQuantity = cartItems[i].getElementsByClassName('cart-quantity')[0];
            if (action == "add") {
                //limits each items quantity in cart to 5
                if (currentQuantity.value < 5) {
                    currentQuantity.value++;
                }
            } else {
                if (currentQuantity.value > 1) {
                    currentQuantity.value--
                        //removes item from cart if quantity is 0       
                } else {
                    currentQuantity.value = 0;
                    cartItems[i].classList.add('d-none')
                }
            }
        }

    }

}

/**
 * updates the total to the current total of cart items
 */
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


document.getElementById('checkout-btn').addEventListener('click', () => {
    var billItems = checkout();
    console.log(billItems)
})

/**
 * returns an array of names and quantities of products present in the cart at the time of checkout
 * index 0,2,4... are product names and 1,3,5... are the quantites of product in previous index
 */
function checkout() {
    var cartItems = document.getElementsByClassName('cart-item');
    var checkoutCart = [];
    for (var i = 0; i < cartItems.length; i++) {
        //pushes only the items that are visible in the cart
        if (!cartItems[i].classList.contains("d-none")) {
            checkoutCart.push(cartItems[i].getElementsByClassName('cart-name')[0].innerText);
            checkoutCart.push(cartItems[i].getElementsByClassName('cart-quantity')[0].value);
        }
    }
    return checkoutCart;
}