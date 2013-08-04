/*global Meteor, Accounts, console*/
(function (Meteor, _) {


    /** Metode 2 - Andre forsøk -------------------*/
    Meteor.startup(function() {
        console.log("Nemean Kiosk is running at server!");
        Products = new Meteor.Collection("products");
    });

    Meteor.methods({
        getCashiers: function () {

        },

         getProducts: function () {
            return Products.find().fetch();
        },

        updateCashiers: function() {
            /*
            //Cashiers.remove({});
            console.log('Updating cashiers');
            var JSONstring = Meteor.http.get("http://nemean.no/mTest.html");
            var users = JSON.parse(JSONstring.content);
            _.each(users, function (user) {
                if (!Cashiers.findOne({strekkode:user.strekkode}))
                {
                   // Cashiers.insert(user);
                    Accounts.createUser({
                        email:user.name,
                        password: user.strekkode,
                        profile: {name: user.name}
                    });
                    Meteor.users.insert({email: user.name, password: user.strekkode}, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        else
                        {
                            console.log('User created');
                        }
                    });
                }
            });
            */
        },

        updateProducts: function() {
            /*
            Products.remove({});
            console.log('Updating products');
            var JSONstring = Meteor.http.get("http://nemean.no/products.html");
            var products = JSON.parse(JSONstring.content);
            _.each(products, function (product) {
                Products.insert(product);
            });
            */
        },

        addProduct: function(product) {
            Products.insert(product);
        },

        removeProduct: function(product) {

        }

    });

}(Meteor, _));