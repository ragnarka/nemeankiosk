(function (Meteor) {
	
	Meteor.startup(function() {
		console.log("Nemean Kiosk is running at client!");
	});

	Meteor.Router.add({
		"/": "start",
		"/cart": "cart",
        "/products": "products",
        "/cashiers": "cashiers",
        "/cashiers/add": "addCashier",
        "/sales": "sales",
        "/stats": "stats"
	});

    /**
     * Name of logged in user to be displayed in view
     * @returns {*}
     */
    Template.index.displayName = function() {
       return (Meteor.userId() && Meteor.user() && Meteor.user().profile) ? Meteor.user().profile.name : '';
    }

    /**
     * Are the logged in user a superuser?
     * @returns {Boolean}
     */
    Template.index.isSuperuser = function() {
        return Roles.userIsInRole(Meteor.user(), ['Superbruker']);
    }


}(Meteor));