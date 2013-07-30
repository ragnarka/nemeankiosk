
(function (Meteor) {

    //Insert code here
    Template.products.helpers({

        products: function(){
            Meteor.call('getProducts', function(errors, result) {
                Session.set('products', result);
            });
            return Session.get("products");
        }
    });
}(Meteor));
