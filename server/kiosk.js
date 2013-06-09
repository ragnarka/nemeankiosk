/*global Meteor, Accounts, console*/

(function (Meteor, _) {
	
	Meteor.startup(function() {
		console.log("Nemean Kiosk is running at server!");
        var test = Meteor.http.get("http://nemean.no/mTest.html");
        cashiers = new Collection("cashiers");
	});
}(Meteor, _));