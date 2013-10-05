( function(Meteor, $, _) {

        var barcode = "", ENTER = 13;

        //Get list of all products
        function getProducts() {
            return Session.get("products");
        }

        // Find product from a session stored in client
        function getProduct(barcode) {
            return _.find(getProducts(), function(p) {
                return (p.barcode == barcode);
            });
        }

        // Get cart
        function getCart() {
            return Session.get("cart");
        }

        // Get one product from cart
        function getCartProduct(barcode) {
            return _.find(getCart(), function(p) {
                return (p.barcode == barcode);
            });
        }

        // Update cart GUI
        function updateCart(cart) {
            Session.set("cart", cart)
        }

        // Update cart with new product
        function updateCartProduct(product) {
            var products = getCart(), newProds = [];
            _.each(products, function(p) {
                if (product.barcode === p.barcode) {
                    p = product;
                }
                newProds.push(p);
            });
            updateCart(newProds);
        }

        // Increase product amoount by one
        function increaseAmount(barcode) {
            // Update amount and total
            var p = getCartProduct(barcode);
            p.amount++;
            updateCartProduct(p);
        }

        // Decrease product amount by one
        function decreaseAmount(barcode) {
            // Update amount and total
            var p = getCartProduct(barcode);
            p.amount--;
            if (p.amount <= 0) {
                removeFromCart(p);
            } else {
                updateCartProduct(p);
            }
        }

        function existsProduct(products, barcode) {
            return _.some(products, function(p) {
                if (p.barcode === barcode) {
                    return true;
                }
                return false
            });
        }

        // Add one product to cart
        function addToCart(product) {
            var prods = getCart();

            if (existsProduct(prods, product.barcode)) {
                increaseAmount(product.barcode);
            } else {
                product.amount = 1;
                prods.push(product);
            }
            updateCart(prods);
        }

        // Remove one product from cart
        function removeFromCart(product) {
            var prods = _.reject(getCart(), function(p) {
                return (p._id == product._id);
            });
            updateCart(prods);
        }

        function scan() {
            $("body").keypress(function(e) {
                var keypressed = String.fromCharCode(e.keyCode);

                if (e.keyCode === ENTER) {
                    var product = getProduct(barcode),
                        cart = getCart();
                    if (_.isObject(product)) {
                        if(existsProduct(cart, barcode)) {
                            increaseAmount(barcode);
                        }
                        else{
                            addToCart(getProduct(barcode));
                        }
                    }
                    if (findCashier(barcode)) {// === CASHIER_BARCODE
                        // Make sale for Cashier
                    }
                    barcode = "";
                } else {
                    barcode += keypressed;
                }
            });
        }

        // Add sale to crew member
        function addToCrewMember(sale, barcode) {

        }

        // Save order to DB with cashiers barcode
        function completeOrder(cart, cashierBarcode) {
            if(!_.isEmpty(cart)){
                Meteor.call("completeOrder", cart, cashierBarcode, new Date());
                resetCart();
            }
            else {
                console.log("Cart's empty!");
            }
        }

        // Find cashier from DB by barcode
        function findCashier(barcode) {
            return null;
        }
        
        function resetCart() {
            Session.set("cart", []);
        }
        
        function getCashierBarcode() {
            return Meteor.user().profile.barcode;
        }

        // Executes when cart template is rendered
        Template.cart.rendered = function() {
            $("body").unbind("keypress");
            scan();

            Meteor.call("getProducts", function(error, p) {
                Session.set("products", p);
            });

            if (_.isEmpty(getCart())) {
                Session.set("cart", []);
            }
        }

        Template.cart.getTotal = function() {
            return this.amount * this.price;
        }

        Template.cart.total = function() {
            var sum = 0;
            _.each(getCart(), function (p) {
                sum += (p.amount * p.price);
            });
            return sum;
        }

        Template.cart.cart = function() {
            return getCart();
        }

        Meteor.autorun(function() {
            Meteor.subscribe("products");
        });

        Template.cart.events({
            // Remove product from cart (GUI)
            'click .delete' : function() {
                removeFromCart(this);
            },

            // Increase amount on one product listed in cart by one
            'click .add' : function() {
                increaseAmount(this.barcode);
            },

            // Decrease amount on one product listed in cart by one
            'click .reduce' : function() {
                decreaseAmount(this.barcode);
            },

            'click .completeOrder' : function() {
                completeOrder(getCart(), getCashierBarcode());
            }
        });

    }(Meteor, $, _));