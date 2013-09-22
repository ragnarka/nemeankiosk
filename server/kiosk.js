/*global Meteor, Accounts, console*/

(function (Meteor, _) {

    // 
    Meteor.startup(function() {
        console.log("Nemean Kiosk is running at server!");
        Products = new Meteor.Collection("products");
        console.log("Have fun!");
        console.log("-------------------------------------------");
    });

// Function imports external products
    function importProducts() {
            Products.remove({});
            var JSONstring = Meteor.http.get("http://nemean.no/products.html");
            var newProducts = JSON.parse(JSONstring.content);
            _.each(newProducts, function (product) {
                Products.insert(product);
            });
            console.log("External products imported");
        }

    function deleteProduct(product) {
        Products.remove({barcode: product.barcode});
    }

    function addProduct(product) {
        Products.insert(product);
        console.log("Product " +product.name+ " was added");
    }

// Publishes product collection
    Meteor.publish("products", function() {
        return Products.find({});
    });

// Publishes cashier collection
    Meteor.publish("cashiers", function() {
        return Cashiers.find({});
    });

    Meteor.methods({
        "addProduct": function(product) {
            addProduct(product);
        },

        "deleteProduct": function(product) {
            deleteProduct(product);
        },

        "importProducts": function() {
            console.log("Hallas");
            importProducts();
        }
    });

}(Meteor, _));