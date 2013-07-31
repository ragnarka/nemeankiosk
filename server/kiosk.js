/*global Meteor, Accounts, console*/

(function (Meteor, _) {
	/*
	 Metode 1 - Første forsøk -------------------------------------
	Meteor.startup(function() {
		console.log("Nemean Kiosk is running at server!");
        var JSONstring = Meteor.http.get("http://nemean.no/mTest.html");
        var users = JSON.parse(JSONstring.content);
        var newUsers = _.filter(users, function (user) {
            if (_.isObject(Cashiers.findOne({"strekkode": user.strekkode})))
            {
                return false;
            }
            return true;
        });
        console.log(newUsers);
        newUsers.forEach(function(cashier){
            Cashiers.insert(cashier);
        });
	});
	*/

    /** Metode 2 - Andre forsøk -------------------*/
    Meteor.startup(function() {
        console.log("Nemean Kiosk is running at server!");
        Cashiers = new Meteor.Collection("cashiers");
        Products = new Meteor.Collection("products");
        Meteor.call('updateCashiers');
        Meteor.setInterval(function() { Meteor.call('updateCashiers');}, 5000);
        Meteor.call('updateProducts');
        Meteor.setInterval(function() { Meteor.call('updateProducts');}, 5000);
    });

    Meteor.methods({
        getCashiers: function () {
            return Cashiers.find().fetch();
        },

         getProducts: function () {
            return Products.find().fetch();
        },

        updateCashiers: function() {
            //Cashiers.remove({});
            console.log('Updating cashiers');
            var JSONstring = Meteor.http.get("http://nemean.no/mTest.html");
            var users = JSON.parse(JSONstring.content);
            _.each(users, function (user) {
                if (!Cashiers.findOne({strekkode:user.strekkode}))
                {
                    Cashiers.insert(user);
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
        },

        updateProducts: function() {
            Products.remove({});
            console.log('Updating products');
            var JSONstring = Meteor.http.get("http://nemean.no/products.html");
            var products = JSON.parse(JSONstring.content);
            _.each(products, function (product) {
                Products.insert(product);
            });
        },

        addCashier: function(cashier) {
            if (!Cashiers.findOne({strekkode:cashier.strekkode}))
            {
                Cashiers.insert(cashier);
                Meteor.users.insert({email: cashier.name, password: cashier.strekkode}, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    else
                    {
                        console.log('User created');
                    }
                });
                console.log('Cashier added ' + cashier.name + ' - ' + cashier.strekkode);
            }
            else
            {
                console.log('Cashier already exists');
            }
        },

        addProduct: function(product) {
            Products.insert(product);
        },

        removeCashier: function(cashier) {
            if (Cashiers.findOne({strekkode:cashier.strekkode}))
            {
                Cashiers.remove(cashier);
                console.log('Cashier ' + cashier.name + ' removed');
            }
        },

        removeProduct: function(product) {

        }

    });

}(Meteor, _));