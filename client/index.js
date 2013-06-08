(function (Meteor) {
	
	Meteor.startup(function() {
		console.log("Nemean Kiosk is running at client!");
	});
	
	Meteor.Router.add({
		"/": "index",
		"/cart": "cart"
	});
}(Meteor));