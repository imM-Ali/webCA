//populates customer list
fetch('https://randomuser.me/api/?results=5&inc=name,picture,email')
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < 5; i++) {
            var customer = " <div id='user_" + (i + 1) + "' class='col-lg-6 col-md-12' style='text-align: -webkit-center;'>"
                + "<div class='card mb-5 shadow rounded' style='width: 20rem;''>"
                + "<img class='card-img-top' style='width:60%; align-self: center; margin-top:5px' src='" + data.results[i].picture.large + "'>"
                + "<div class='card-body'><h5 class='card-title'>" + data.results[i].name.first + " " + data.results[i].name.last + "</h5></div>"
                + "<ul class='list-group list-group-flush'><li class='list-group-item'>" + data.results[i].email + "</li></ul>"
                + "<div class='card-body'><a href='#/' id='modalCall_" + i + "' class='card-link'>Take order</a></div></div></div>"
            document.getElementById('content').innerHTML += customer;

        }


    }).then(() => {

        var takeOrder = document.querySelectorAll('.card-link');
        takeOrder.forEach(element => {
            var parent = element.parentElement.parentElement.parentElement.id
            element.addEventListener('click', () => {
                document.getElementById('modalForm').innerHTML += "<input type='hidden' name='parent' value='" + parent + "'>"
                document.getElementById('myModal').style.removeProperty("display")
                document.getElementById('myModal').style.display = 'flex'
            })
        })

        document.getElementById('modalForm').addEventListener('submit', (e) => {
            e.preventDefault();
            var price = cal();
            const formData = new FormData(e.target);
            if (formData.get("subFood") != 'select') {
                if (localStorage.getItem(formData.get("parent")) == null) {
                    console.logJSON.stringify(Object.fromEntries(formData));
                    localStorage.setItem(formData.get("parent"), cart);
                } else if (localStorage.getItem(formData.get("parent")) != null) {
                    var key = formData.get("parent");
                    var oldValue = localStorage.getItem(formData.get("parent"));
                    var cart = JSON.stringify(Object.fromEntries(formData));
                    var newVal = oldValue + cart;
                    localStorage.setItem(key, newVal);
                    
                    
                }
                document.getElementById('tobe').innerHTML = "<div>Price: <p><strong>"+price+"</strong></p></div>"
            }
        })

    })

function populate() {
    fetch('food.json')
        .then(response => response.json())
        .then(data => {
            var el = document.getElementById('category');
            document.getElementById('subCategory').innerHTML = " <option value='select'>Select..</option>";
            document.getElementById('subGroup').removeAttribute("hidden")
            if (el.value == 1) {

                for (let i = 0; i < 3; i++) {

                    document.getElementById('subCategory').innerHTML += "<option data-price='" + data.starters[i].price + "' value='" + i + "'>" + data.starters[i].name + "</option>"

                }
            } else if (el.value == 2) {
                for (let i = 0; i < 3; i++) {
                    document.getElementById('subCategory').innerHTML += "<option data-price='" + data.mains[i].price + "' value='" + i + "'>" + data.mains[i].name + "</option>"
                }
            }


            //will write to modal


        });

}

function cal() {
    var selected = document.getElementById('subCategory');
    document.getElementById('price').value = selected.options[selected.selectedIndex].dataset.price;
    return document.getElementById('price').value;

}