
(function (Meteor) {


    //Get list of all products
    function getProducts() {
        var products = Session.get("products");
        return products;
    }

    //Function runs everytime page renders
    Template.products.rendered = function (){
        getProducts();
        Session.set('addProduct', false);
    };

    // Sets variable wether to add product or not
    Template.products.addProduct = function() {
        var addP = Session.get('addProduct');
        return addP;
    }

}(Meteor));
