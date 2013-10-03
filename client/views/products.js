
(function (Meteor, _, $) {

    var collection = new Meteor.Collection("products");

    //Get list of all products

    function findProducts() {
        Meteor.subscribe("products");
        var products = collection.find().fetch();
        return products;
    }

    // Check if product already exists

    function productExists(product) {
        var products = collection,
        result = collection.findOne({
            barcode:product.barcode
        });
        return result;
    }

    // Create product from HTML elements

    function createProduct(elements, product) {
        var product = _.isObject(product) ? product : {}; 
        _.each(elements, function(element) {
                product[element.id] = $.trim(element.value);
            });
        return product;
    }

    // Add new product

    function addNewProduct(product) {
        if(productExists(product) || !validateProduct(product)) {
                return false;
            }
            Meteor.call("addProduct", product);
    }

    // Update existing product

    function updateProduct(product) {
        Meteor.call("updateProduct", product);
    }

    // Delete product

    function deleteProduct(product) {
        Meteor.call("deleteProduct", product.barcode);
    }

    // Validate product

    function validateProduct(product) {

        // Check if barcode is string - not empty
        if(!_.isString(product.barcode) || _.isEmpty(product.barcode)) {
            console.log("Error");
            return false;
        }

        // Check for empty product name
        if(!_.isString(product.name) || _.isEmpty(product.name)) {
            console.log("Error");
            return false;
        }

        // Check for valid price > 0
        if(product.price <= 0 || product.purchasePrice <=0) {
            console.log("Error");
            return false;
        }
        return true;
    }

    // Session variable handles wether to show add product view or not

    function setAddProductSession() {
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

    // Returns all products from collection

    Template.products.products = function() {
        return findProducts();
    }

    // Sets session variable for product edit

    Template.products.editProduct = function() {
        var product = this;
        return Session.get("editProduct") == product.barcode;
    }

    // Events for products view

    Template.products.events({
        'click .add': function() {
            setAddProductSession();
        },

        'click .save': function() {
            var product = this,
            elements = $.find("input");
            product = createProduct(elements, product);
            updateProduct(product);
            Session.set("editProduct", "");
        },

        'click .edit': function() {
            var product = this;
            Session.set("editProduct", product.barcode);
        },

        'click .delete': function() {
            var product = this;
            deleteProduct(product);
        },

        'click .newProduct': function() {
            var elements = $.find("input"),
            product = createProduct(elements);
            addNewProduct(product);
            setAddProductSession();
        },

        'click .import': function() {
            Meteor.call("importProducts");
        },

        'click .cancel': function() {
            setAddProductSession();
        }
    });
}(Meteor, _, $));
