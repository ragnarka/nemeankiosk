

(function (Meteor) {
	
	Meteor.startup(function() {
        Session.set("cashiers");
		console.log("Nemean Kiosk is running at client!");
        Meteor.subscribe("cashiers", Session.get("cashiers"));
        loadCashiers();
	});

	Meteor.Router.add({
		"/": "cart",
		"/cart": "cart",
        "/products": "products",
        "/cashiers": "cashiers",
        "/sales": "sales",
        "/stats": "stats"
	});

    /**
     * Fetch all cashiers
     * @returns {*}
     */
    loadCashiers = function(){
        Meteor.call('getCashiers', function(errors, result) {
            Session.set('cashiers', result);
        });
    }

    Template.index.loggedIn = function() {
        return Session.get('loggedIn');
    }

    Template.index.displayName = function() {
        return Session.get('loginName');
    }

}(Meteor));