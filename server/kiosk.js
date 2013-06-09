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
        Meteor.call('updateCashiers');
        Meteor.setInterval(function() { Meteor.call('updateCashiers');}, 5000);
    });

    Meteor.methods({
        getCashiers: function () {
            return Cashiers.find().fetch();
        },
        updateCashiers: function() {
            Cashiers.remove({});
            console.log('fasbasdfasdfa');
            var JSONstring = Meteor.http.get("http://nemean.no/mTest.html");
            var users = JSON.parse(JSONstring.content);
            _.each(users, function (user) {
                Cashiers.insert(user);
            });
        }

    });

}(Meteor, _));