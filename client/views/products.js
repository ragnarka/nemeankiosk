
(function (Meteor) {

    var collection = new Meteor.Collection("products");

    //Get list of all products
    function findProducts() {
        Meteor.subscribe("products");
        var products = collection.find().fetch();
        return products;
    }

    function productExists(product) {
        var products = collection,
        result = collection.findOne({
            barcode:product.barcode
        });
        return result;
    }

    function validateProduct(product) {

        if(!_.isString(product.barcode) || isEmpty(product.barcode)) {
            console.log("Error");
            return false;
        }

        if(!_.isString(product.name) || isEmpty(product.name)) {
            console.log("Error");
            return false;
        }

        if(product.price <= 0 || product.purchasePrice <=0) {
            console.log("Error");
            return false;
        }
        return true;
    }
    
    function addProductSession() {
        var add = Session.get("addProduct") === true ? false : true;
            Session.set("addProduct", add);
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
        return findProducts();
    }

    // Events for products view
    Template.products.events({
        'click .add': function() {
            addProductSession();
        },

        'click .newProduct': function() {
            var elements = $.find("input"),
                product = {};

            _.each(elements, function(element) {
                product[element.id] = element.value;
            });

            if(productExists(product) || !validateProduct(product)) {
                return false;
            }
            Meteor.call("addProduct", product);
            addProductSession();
        },

        'click .import': function() {
            Meteor.call("importProducts");
        },

        'click .cancel': function() {
            addProductSession();
        }
    });
}(Meteor));
