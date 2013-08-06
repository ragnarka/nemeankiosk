
(function (Meteor) {

    var collection = new Meteor.Collection("products");

    //Get list of all products
    function findProducts() {
        Meteor.subscribe("products");
        var products = collection;
        return products;
    }

    //Function runs everytime page renders
    Template.products.rendered = function (){
        findProducts();
    }

    // Sets variable wether to add product or not
    Template.products.addProduct = function() {
        return true;
    }

    Template.products.products = function() {
        return collection.find().fetch();
    }
}(Meteor));
