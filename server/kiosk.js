/*global Meteor, Accounts, console*/

(function (Meteor, _) {

    // 
    Meteor.startup(function() {
        console.log("Nemean Kiosk is running at server!");
        Cashiers = new Meteor.Collection("cashiers");
        Products = new Meteor.Collection("products");
        importProducts();
        importCashiers();
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

// Function imports external cashiers
    function importCashiers() {
        Cashiers.remove({});
            var JSONstring = Meteor.http.get("http://nemean.no/mTest.html");
            var users = JSON.parse(JSONstring.content);
            _.each(users, function (user) {
                Cashiers.insert(user);
            });
            console.log("External users imported");
    }

// Publishes product collection
    Meteor.publish("products", function() {
        return Products.find({});
    });

// Publishes cashier collection
    Meteor.publish("cashiers", function() {
        return Cashiers.find({});
    });

}(Meteor, _));