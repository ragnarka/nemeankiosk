(function (Meteor, _) {
	
	Meteor.startup(function() {
		console.log("Nemean Kiosk is running at client!");
       // Meteor.Router.to("/cart");
	});




	Meteor.Router.add({
		"/": "front",
		"/cart": "cart"
	});

}(Meteor));