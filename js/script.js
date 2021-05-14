/**
 * Part 1
 */

let errorEle = document.getElementById('error');
let password = document.getElementById('pass');
let nxtBtn = document.getElementById('mybtn');
let errMsg;

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

/**
 * fetches the random users from API and displays it if no error was found in password
 */
nxtBtn.addEventListener('click', (e) => {
    if (errMsg != "") {
        e.preventDefault();
    } else {

        fetch('https://randomuser.me/api/?results=5&inc=name,picture,email').then(response => response.json()).then(data => {
            document.getElementById('section1').style.display = 'none';
            //creates a bootstrap cart for each customer to load into
            for (let i = 0; i < 5; i++) {
                let customer = "<div id='user_" + (i + 1) + "' class='col-lg-3 col-md-4 col-sm-6 user-card'>" +
                    "<div class='card mb-5 mt-5 shadow rounded'>" +
                    "<img class='card-img-top' src='" + data.results[i].picture.large + "'>" +
                    "<div class='card-body p-2'><h5 class='card-title'>" + data.results[i].name.first + " " + data.results[i].name.last + "</h5>" +
                    "<p>" + data.results[i].email + "</p></div><hr>"
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
            /**
             * takes the food object and the name of container where it will be appended
             */
            function populate(object, ContainerName) {
                let foodContainer = document.getElementsByClassName(ContainerName)[0];
                //populating menu  
                // adds the 'vegetarian' tag if object.isVeg property is true in line 90      
                foodContainer.innerHTML += `        
        <div data-name="${object.name}" class="menu-item  form-group">
        <strong>${object.name} ${object.isVeg?`<span class="text-success" style="font-size:0.6em">- Vegetarian<span>`:''}</strong><br /> - 
        <span style="font-size:0.6em">
         <strong>${object.description}</strong>
         <span>   
         <span class="remove-btn btn btn-secondary">-
         </span>  
         <span class="add-to-cart-btn btn btn-secondary">+
         </span>
         </div>`;
        //populating cart - hidden on initital state
        let cart = document.getElementById('cart');
        cart.innerHTML += `<div data-type="${foodContainer.classList[0]}" class="cart-item mt-2 mb-4 d-none">
        <span class="cart-name">${object.name}</span>
        <input class="isVeg" hidden type="text" value="${object.isVeg?`yes`:'no'}">    
        <input class="cart-quantity" placeholder="0" type="number" min="0" max="5" readOnly>
        <span class="cart-price">${object.price} /pc</span>
        </div>`
    }
    //calling populate method on the data returned from the JSON
    Object.entries(data).forEach((category) => {
        //category 0 has the category names and category 1 has the objects
        category[1].forEach((item) => {
            populate(item, category[0])
        })
    })

}).then(() => {
    document.querySelectorAll('.add-to-cart-btn').forEach(item => {
        item.addEventListener('click', (event) => {
            //gets the name of product corresponding the add button which is clicked and passes it to cart handler
            let parentElement = event.target.parentElement.parentElement.parentElement;
            cartHandler(parentElement.dataset.name);
        })
    });
    document.querySelectorAll('.remove-btn').forEach(item => {
        item.addEventListener('click', (event) => {
            //gets the name of product corresponding the delete button which is clicked and passes it to cart handler with the action 'remove'
            let parentElement = event.target.parentElement.parentElement.parentElement;
            cartHandler(parentElement.dataset.name, "remove");
        })
    });
})

/**
 * --unhides the clicked product in cart--
 * By default, any product passed in params will be added to cart.
 * To remove, you have to pass "remove" with the to-be removed element
 */
function cartHandler(passedName, action = "add") {
    let cartItems = document.getElementsByClassName('cart-item')
    for (let i = 0; i < cartItems.length; i++) {
        let cartItemName = cartItems[i].getElementsByClassName('cart-name')[0].innerText;
        //unhide the element in the cart if its name matches the passed name
        if (cartItemName == passedName) {
            cartItems[i].classList.remove('d-none');
            let currentQuantity = cartItems[i].getElementsByClassName('cart-quantity')[0];

            //if the action is add       
            if (action == "add") {
                //limits each items quantity in cart to 5
                if (currentQuantity.value < 5) {
                    currentQuantity.value++;
                }

                //if the action is delete
            } else {
                //if item current value greater than 1, decrease 1
                if (currentQuantity.value > 1) {
                    currentQuantity.value--
                } else {
                    //removes item from cart   
                    currentQuantity.value = 0;
                    cartItems[i].classList.add('d-none')
                }
            }
        }

    }

}


document.getElementById('checkout-btn').addEventListener('click', checkout);

/**
 * Calculates and displays the total price of the cart by dividing items according to types
 */
function checkout() {
    //resetting the fields everytime function is called
    document.getElementById('mainsTotal').innerHTML = "";
    document.getElementById('startersTotal').innerHTML = ""
    document.getElementById('dessertsTotal').innerHTML= "";
    document.getElementById('drinksTotal').innerHTML= "";
    let cartItems = document.getElementsByClassName('cart-item');
    let mainsTotal = 0,
        startersTotal = 0,
        dessertsTotal = 0,
        drinksTotal = 0,
        vegTotal=0,
        nonvegTotal=0,
        total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        //only on items that are visible in the cart
        if (!cartItems[i].classList.contains("d-none")) {
            
            let price = cartItems[i].getElementsByClassName('cart-price')[0].innerText;
            price.replace(' /pc', '');
            let quantity = cartItems[i].getElementsByClassName('cart-quantity')[0].value;
            //the second child element of cart item is the hidden field whose value is 'yes' if product is vegetarian
            if(cartItems[i].getElementsByClassName('isVeg')[0].value=='yes'){
                vegTotal = vegTotal + (parseFloat(price) * quantity)
                
            }                
            switch (cartItems[i].dataset.type) {
                case "mains":
                    mainsTotal = mainsTotal + (parseFloat(price) * quantity)
                    document.getElementById('mainsTotal').innerHTML = `€ ${mainsTotal.toFixed(2)}`;
                    if(cartItems[i].getElementsByClassName('isVeg')[0].value=='no'){
                        nonvegTotal = nonvegTotal + (parseFloat(price) * quantity)
                    }
                    break;
                case "starters":
                    startersTotal = startersTotal + (parseFloat(price) * quantity)
                    document.getElementById('startersTotal').innerHTML = `€ ${startersTotal.toFixed(2)}`;
                    if(cartItems[i].getElementsByClassName('isVeg')[0].value=='no'){
                        nonvegTotal = nonvegTotal + (parseFloat(price) * quantity)
                    }
                    break;
                case "desserts":
                    dessertsTotal = dessertsTotal + (parseFloat(price) * quantity);
                    document.getElementById('dessertsTotal').innerHTML = `€ ${dessertsTotal.toFixed(2)}`;
                    break;
                case "drinks":
                    drinksTotal = drinksTotal + (parseFloat(price) * quantity);
                    document.getElementById('drinksTotal').innerHTML = `€ ${drinksTotal.toFixed(2)}`;
                    break;
                default:
                    break;
            }
        }
    }
    total = mainsTotal + startersTotal + dessertsTotal + drinksTotal;    
    document.getElementsByClassName('cart-total')[0].innerHTML = `Total: € ${total.toFixed(2)} `;
    //styling bars to display veg vs Non veg
    let vegEl = document.getElementById('vegBar');
    let nonvegEl = document.getElementById('nonvegBar');
    vegEl.style.width = `${vegTotal*10}px`;
    vegEl.innerHTML = `Veg: €${vegTotal.toFixed(2)}`
    nonvegEl.style.width = `${nonvegTotal*10}px`;
    nonvegEl.innerHTML = `Non-Veg: €${nonvegTotal.toFixed(2)}`
}