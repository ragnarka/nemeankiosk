
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
        return Session.get("addProduct");
    }

    Template.products.products = function() {
        return collection.find().fetch();
    }

    // Events for products view
    Template.products.events({
        'click .add': function() {
            var add = Session.get("addProduct") === true ? false : true;
            Session.set("addProduct", add);
            
        },

        'click .newProduct': function() {
            var elements = $.find("input"),
                product = {};
            console.log($(elements[0]).val());
            
            _.each(elements, function(element) {
                console.log(element);
            });
            
        }

    });
}(Meteor));
