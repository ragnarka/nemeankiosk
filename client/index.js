

(function (Meteor, _) {
	
	Meteor.startup(function() {
        Session.set("cashiers");
		console.log("Nemean Kiosk is running at client!");
        Meteor.subscribe("cashiers", Session.get("cashiers"));
	});




	Meteor.Router.add({
		"/": "front",
		"/cart": "cart",
        "/products": "products",
        "/cashiers": "cashiers",
        "/sales": "sales",
        "/stats": "stats"
	});

}(Meteor));