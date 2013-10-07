/*global Meteor, Accounts, console*/

( function(Meteor, _) {

    // 
    Meteor.startup(function() {
        console.log("Nemean Kiosk is running at server!");
        Products = new Meteor.Collection("products");
        console.log("Have fun!");
            Orders = new Meteor.Collection("orders");
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
    function deleteProduct(barcode) {
        Products.remove({barcode: barcode});
    }

    function updateProduct(product) {
        Products.update({_id: product._id}, {$set: {
            price: product.price,
            purchasePrice: product.purchasePrice,
            amount: product.amount
        }});
    }

    function addProduct(product) {
        Products.insert(product);
        console.log("Product " +product.name+ " was added");
    }

// Publishes product collection
    Meteor.publish("products", function() {
        return Products.find({});
    });

        Meteor.methods({

            'getProducts' : function() {
    Meteor.methods({
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
        "addProduct": function(product) {
            addProduct(product);
        },

        "deleteProduct": function(barcode) {
            deleteProduct(barcode);
        },

        "updateProduct": function(product) {
            console.log(product);
            updateProduct(product);
        },


        "importProducts": function() {
            console.log("Hallas");
            importProducts();
        }
        Meteor.publish("orders", function() {
            return Orders.find({});
        });

        // Publishes cashier collection
        Meteor.publish("cashiers", function() {
            return Cashiers.find({});
        });
    });

}(Meteor, _));