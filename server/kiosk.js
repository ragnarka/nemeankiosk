/*global Meteor, Accounts, console*/

( function(Meteor, _) {

        //
        Meteor.startup(function() {
            console.log("Nemean Kiosk is running at server!");
            Products = new Meteor.Collection("products");
            Orders = new Meteor.Collection("orders");
            importProducts();
            console.log("Have fun!");
            console.log("-------------------------------------------");
        });

        // Function imports external products
        function importProducts() {
            Products.remove({});
            var JSONstring = Meteor.http.get("http://nemean.no/products.html");
            var newProducts = JSON.parse(JSONstring.content);
            _.each(newProducts, function(product) {
                Products.insert(product);
            });
            console.log("External products imported");
        }

        function insertOrder(order) {
            Orders.insert(order);
            console.log(Orders.find({}).fetch());
        }

        Meteor.methods({

            'getProducts' : function() {
                return Products.find().fetch();
            },

            'completeOrder' : function(cart, cashierBarcode, date) {
                var order = {};
                order.cart = cart;
                order.cashier = cashierBarcode;
                order.date = date;
                insertOrder(order);
            }
        });

        // Publishes product collection
        Meteor.publish("products", function() {
            return Products.find({});
        });

        // Publishes product collection
        Meteor.publish("orders", function() {
            return Orders.find({});
        });

        // Publishes cashier collection
        Meteor.publish("cashiers", function() {
            return Cashiers.find({});
        });

    }(Meteor, _));